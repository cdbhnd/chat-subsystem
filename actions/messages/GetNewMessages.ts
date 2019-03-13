import { Types } from "../../infrastructure/dependency-injection/";
import { OrganizationActionBase } from "../AuthorizationActionBase";
import * as Repositories from "../../repositories";
import * as Entities from "../../entities/";
import { injectable, inject } from "inversify";

@injectable()
export class GetNewMessages extends OrganizationActionBase<Entities.IMessage[]> {

  private conversationRepo: Repositories.IConversationRepository;
  private messageRepo: Repositories.IMessageRepository;

  constructor(@inject(Types.IConversationRepository) conversationRepo,
              @inject(Types.IOrganizationRepository) orgRepo,
              @inject(Types.IMessageRepository) messageRepo) {
    super(orgRepo);
    this.conversationRepo = conversationRepo;
    this.messageRepo = messageRepo;
  };

  public async execute(context): Promise<Entities.IMessage[]> {
    const conversations: Entities.IConversation[] = await this.conversationRepo.find({ userIds: context.params.userId });

    const conversationIds: string[] = conversations.map((c) => {
        return c.id;
    });

    const messages: Entities.IMessage[] = await this.messageRepo.find({ conversationId: { $in: conversationIds } });

    const newMessages = messages.filter((m: Entities.IMessage) => {
        return m.fromId !== context.params.userId &&
              (!m.readers || m.readers.indexOf(context.params.userId) === -1) &&
              (!m.seenBy || m.seenBy.indexOf(context.params.userId) === -1);
    });
    newMessages.forEach(async (nm) => {
      if (!nm.seenBy) {
        nm.seenBy = [];
      }
      nm.seenBy.push(context.params.userId);
      await this.messageRepo.update(nm);
    });
    return newMessages;
  }

  protected getConstraints(): any {
    return {
      userId: "string|required",
    };
  }

  protected getSanitizationPattern(): any {
    return {};
  }
}
