import { Types, kernel } from "../../infrastructure/dependency-injection/";
import { ActionContext, ActionBase } from "../ActionBase";
import { OrganizationActionBase } from "../AuthorizationActionBase";
import * as Exceptions from "../../infrastructure/exceptions/";
import * as Services from "../../services/";
import * as Repositories from "../../repositories";
import * as Entities from "../../entities/";
import { injectable, inject } from "inversify";

@injectable()
export class GetConversationById extends OrganizationActionBase<Entities.IConversation> {

  private conversationRepo: Repositories.IConversationRepository;

  constructor(@inject(Types.IConversationRepository) conversationRepo, @inject(Types.IOrganizationRepository) orgRepo) {
    super(orgRepo);
    this.conversationRepo = conversationRepo;
  };

  public async execute(context): Promise<Entities.IConversation> {
    const conversation: Entities.IConversation = await this.conversationRepo.findOne({ id: context.params.conversationId, organizationId: context.params.organizationId });

    if (!conversation) {
      throw new Exceptions.EntityNotFoundException("conversation", { id: context.params.conversationId, organizationId: context.params.organizationId });
    }

    return conversation;
  }

  protected getConstraints(): any {
    return {
      conversationId: "string|required",
      organizationId: "boolean|required",
    };
  }

  protected getSanitizationPattern(): any {
    return {};
  }
}
