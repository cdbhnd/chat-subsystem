import { Types } from "../../infrastructure/dependency-injection/";
import { OrganizationActionBase } from "../AuthorizationActionBase";
import * as Repositories from "../../repositories";
import * as Entities from "../../entities/";
import { injectable, inject } from "inversify";

@injectable()
export class GetNewMessages extends OrganizationActionBase<Entities.IMessage[]> {

  private conversationRepo: Repositories.IConversationRepository;
  private messageRepo: Repositories.IMessageRepository;

  constructor(
    @inject(Types.IConversationRepository) conversationRepo,
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

    return await this.messageRepo.find({ conversationId: { $in: conversationIds }, fromId: { $ne: context.params.userId }, seenBy: { $exists: true, $ne: context.params.userId } });
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
