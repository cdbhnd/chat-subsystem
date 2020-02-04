import { Types } from "../../infrastructure/dependency-injection/";
import { OrganizationActionBase } from "../AuthorizationActionBase";
import * as Repositories from "../../repositories";
import * as Entities from "../../entities/";
import { injectable, inject } from "inversify";
import { ConversationType } from "../../entities/";

@injectable()
export class CreateConversation extends OrganizationActionBase<Entities.IConversation> {

  private conversationRepo: Repositories.IConversationRepository;

  constructor(@inject(Types.IConversationRepository) conversationRepo: Repositories.IConversationRepository, @inject(Types.IOrganizationRepository) orgRepo) {
    super(orgRepo);
    this.conversationRepo = conversationRepo;
  }

  public async execute(context): Promise<Entities.IConversation> {
    const conversation: Entities.IConversation = {
      id: null,
      image: context.params.image ? context.params.image : null,
      name: context.params.name,
      organizationId: context.params.organizationId,
      users: [],
      lastMessage: null,
      lastMessageTimestamp: null,
      type: context.params.type ? context.params.type : ConversationType.PRIVATE,
    };
    return await this.conversationRepo.create(conversation);
  }

  protected getConstraints(): any {
    return {
      name: "string|required",
      image: "string",
      organizationId: "string|required",
      type: "string",
    };
  }

  protected getSanitizationPattern(): any {
    return {};
  }
}
