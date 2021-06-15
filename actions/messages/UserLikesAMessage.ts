import { injectable, inject } from "inversify";
import { Types } from "../../infrastructure/dependency-injection";
import { OrganizationActionBase } from "../AuthorizationActionBase";
import * as Entities from "../../entities";
import * as Repositories from "../../repositories";
import * as Exceptions from "../../infrastructure/exceptions";
import { IEventMediator } from "../../infrastructure/eventEngine/IEventMediator";
import { EventAggregator } from "../../infrastructure/eventEngine/EventAggregator";

@injectable()
export class UserLikesAMessage extends OrganizationActionBase<Entities.IMessage> {

  private messageRepo: Repositories.IMessageRepository;
  private userRepo: Repositories.IUserRepository;
  private convRepo: Repositories.IConversationRepository;
  private eventMediator: IEventMediator;

  constructor(
    @inject(Types.IMessageRepository) messagerepo: Repositories.IMessageRepository,
    @inject(Types.IUserRepository) userRepo: Repositories.IUserRepository,
    @inject(Types.IConversationRepository) convRepo: Repositories.IConversationRepository,
    @inject(Types.IOrganizationRepository) orgRepo: Repositories.IOrganizationRepository,
    @inject(Types.EventMediator) eventMediator: IEventMediator) {
    super(orgRepo);
    this.messageRepo = messagerepo;
    this.userRepo = userRepo;
    this.convRepo = convRepo;
    this.eventMediator = eventMediator;
  }

  public async execute(context): Promise<Entities.IMessage> {
    const user: Entities.IUser = await this.userRepo.findOne({ id: context.params.userId, organizationId: context.params.organizationId });
    if (!user) {
      throw new Exceptions.EntityNotFoundException("user", context.params.userId);
    }
    const message: Entities.IMessage = await this.messageRepo.findOne({ id: context.params.messageId });
    if (!message) {
      throw new Exceptions.EntityNotFoundException("message", context.params.messageId);
    }
    const conversation: Entities.IConversation = await this.convRepo.findOne({ id: message.conversationId });
    if (!conversation) {
      throw new Exceptions.EntityNotFoundException("conversation", message.conversationId);
    }
    const partOfConversation = conversation.users.filter((u) => u.id === user.id);
    if (!partOfConversation.length) {
      if (conversation.type !== Entities.ConversationType.PUBLIC) {
        throw new Exceptions.UseOperationNotAllowed("Only users that are part of the conversation can like messages");
      }
      conversation.users.push(this.getConversationUser(user));
      await this.convRepo.update(conversation);
    }
    if (!message.likedBy) {
      message.likedBy = [];
    }
    const alreadyLiked = message.likedBy.filter((liked) => liked.id === user.id);
    if (alreadyLiked.length) {
      return message;
    }
    message.likedBy.push(this.getConversationUser(user));
    const newMessage = await this.messageRepo.update(message);

    this.eventMediator.boradcastEvent(EventAggregator.MESSAGE_LIKED, newMessage);

    return newMessage;
  }

  protected getConstraints(): any {
    return {
      userId: "string|required",
      messageId: "string|required",
    };
  }

  protected getSanitizationPattern(): any {
    return {};
  }

  private getConversationUser(user: Entities.IUser): Entities.IConversationUser {
    return {
      id: user.id,
      image: user.image,
      name: `${user.firstName} ${user.lastName}`,
    };
  }
}
