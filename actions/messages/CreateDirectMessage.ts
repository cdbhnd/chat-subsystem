import { Types } from "../../infrastructure/dependency-injection/";
import { OrganizationActionBase } from "../AuthorizationActionBase";
import * as Exceptions from "../../infrastructure/exceptions/";
import * as Repositories from "../../repositories";
import * as Entities from "../../entities/";
import { injectable, inject } from "inversify";
import { IEventMediator } from "../../infrastructure/eventEngine/IEventMediator";
import { EventAggregator } from "../../infrastructure/eventEngine/EventAggregator";
import { IConversationRepository } from "../../repositories";
import { ConversationType, IUser, IConversationUser } from "../../entities/";

@injectable()
export class CreateDirectMessage extends OrganizationActionBase<Entities.IMessage> {

  private messageRepo: Repositories.IMessageRepository;
  private userRepo: Repositories.IUserRepository;
  private eventMediator: IEventMediator;
  private conversationRepo: IConversationRepository;

  constructor(
    @inject(Types.IMessageRepository) messagerepo: Repositories.IMessageRepository,
    @inject(Types.IOrganizationRepository) orgRepo,
    @inject(Types.IUserRepository) userRepo: Repositories.IUserRepository,
    @inject(Types.EventMediator) eventMediator: IEventMediator,
    @inject(Types.IConversationRepository) conversationRepo: IConversationRepository) {
    super(orgRepo);
    this.messageRepo = messagerepo;
    this.userRepo = userRepo;
    this.eventMediator = eventMediator;
    this.conversationRepo = conversationRepo;
  }

  public async execute(context): Promise<Entities.IMessage> {
    const sender: Entities.IUser = await this.userRepo.findOne({ id: context.params.fromId, organizationId: context.params.organizationId });
    if (!sender) {
      throw new Exceptions.EntityNotFoundException("user", context.params.fromId);
    }
    const convSender = this.getConversationUser(sender);

    const user: Entities.IUser = await this.userRepo.findOne({ id: context.params.toId, organizationId: context.params.organizationId });
    if (!user) {
      throw new Exceptions.EntityNotFoundException("user", context.params.toId);
    }
    const convUser = this.getConversationUser(user);

    let conversation = await this.conversationRepo.findOne({
      $and: [
        { users: { $elemMatch: { id: convSender.id } } },
        { users: { $elemMatch: { id: convUser.id } } },
        { type: ConversationType.DIRECT },
      ],
    });
    if (context.params.replyTo) {
      if (!conversation) {
        throw new Exceptions.UseOperationNotAllowed("You can't reply to a message in the conversation that doesn't exist");
      }
      if (context.params.replyTo.conversationId !== conversation.id) {
        throw new Exceptions.UseOperationNotAllowed("You can't reply to a message from different conversation");
      }
    }
    if (!conversation) {
      conversation = await this.conversationRepo.create({
        id: null,
        image: null,
        lastMessage: null,
        lastMessageTimestamp: null,
        name: `${sender.firstName} ${sender.lastName}, ${user.firstName} ${user.lastName}`,
        organizationId: context.params.organizationId,
        type: ConversationType.DIRECT,
        users: [
          convSender,
          convUser,
        ],
      });
    }

    let message: Entities.IMessage = {
      id: null,
      readers: [context.params.fromId],
      content: context.params.content,
      fromId: context.params.fromId,
      conversationId: conversation.id,
      conversationName: conversation.name,
      timestamp: new Date().toISOString(),
      fromName: convSender.name,
      type: context.params.type || "text",
      replyTo: context.params.replyTo ? context.params.replyTo : null,
    };
    message = await this.messageRepo.create(message);

    this.eventMediator.boradcastEvent(EventAggregator.NEW_MESSAGE, message);

    conversation.lastMessage = message.content;
    conversation.lastMessageTimestamp = message.timestamp;

    this.conversationRepo.update(conversation);

    return message;
  }

  protected getConstraints(): any {
    return {
      content: "string|required",
      fromId: "string|required",
      toId: "string|required",
      replyTo: "object",
    };
  }

  protected getSanitizationPattern(): any {
    return {};
  }

  private getConversationUser(user: IUser): IConversationUser {
    return {
      id: user.id,
      image: user.image,
      name: `${user.firstName} ${user.lastName}`,
    };
  }
}
