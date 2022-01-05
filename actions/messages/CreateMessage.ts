import { Types } from "../../infrastructure/dependency-injection/";
import { OrganizationActionBase } from "../AuthorizationActionBase";
import * as Exceptions from "../../infrastructure/exceptions/";
import * as Repositories from "../../repositories";
import * as Entities from "../../entities/";
import { injectable, inject } from "inversify";
import { IEventMediator } from "../../infrastructure/eventEngine/IEventMediator";
import { EventAggregator } from "../../infrastructure/eventEngine/EventAggregator";
import { IConversationRepository } from "../../repositories";
import { ConversationType } from "../../entities/";
import { UseOperationNotAllowed } from "../../infrastructure/exceptions/";

@injectable()
export class CreateMessage extends OrganizationActionBase<Entities.IMessage> {

  private messageRepo: Repositories.IMessageRepository;
  private userRepo: Repositories.IUserRepository;
  private eventMediator: IEventMediator;
  private conversationRepo: IConversationRepository;

  constructor(
    @inject(Types.IMessageRepository) messageRepo: Repositories.IMessageRepository,
    @inject(Types.IOrganizationRepository) orgRepo,
    @inject(Types.IUserRepository) userRepo: Repositories.IUserRepository,
    @inject(Types.EventMediator) eventMediator: IEventMediator,
    @inject(Types.IConversationRepository) conversationRepo: IConversationRepository) {
    super(orgRepo);
    this.messageRepo = messageRepo;
    this.userRepo = userRepo;
    this.eventMediator = eventMediator;
    this.conversationRepo = conversationRepo;
  }

  public async execute(context): Promise<Entities.IMessage> {
    const user: Entities.IUser = await this.userRepo.findOne({ id: context.params.fromId, organizationId: context.params.organizationId });
    if (!user) {
      throw new Exceptions.EntityNotFoundException("user", context.params.fromId);
    }
    const convUser = this.getConversationUser(user);

    const conversation = await this.conversationRepo.findOne({ id: context.params.conversationId });
    if (!conversation) {
      throw new Exceptions.EntityNotFoundException("conversation", context.params.conversationId);
    }

    const existingUser = conversation.users.find((x) => x.id === user.id);

    if (!existingUser) {
      if (conversation.type !== ConversationType.PUBLIC) {
        throw new UseOperationNotAllowed("Only participants in non-public conversations are allowed to send messages");
      }
      conversation.users.push(convUser);
    }

    if (context.params.replyTo && context.params.replyTo.conversationId !== conversation.id) {
      throw new UseOperationNotAllowed("You can't reply to a message from different conversation");
    }

    let message: Entities.IMessage = {
      id: null,
      readers: [context.params.fromId],
      content: context.params.content,
      fromId: context.params.fromId,
      conversationId: context.params.conversationId,
      conversationName: conversation.name,
      timestamp: new Date().toISOString(),
      fromName: convUser.name,
      type: context.params.type || "text",
      replyTo: context.params.replyTo ? context.params.replyTo : null,
      seenBy: [],
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
      type: "string",
      fromId: "string|required",
      conversationId: "string|required",
      replyTo: "object",
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
