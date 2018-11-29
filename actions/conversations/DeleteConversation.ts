import { Types, kernel } from "../../infrastructure/dependency-injection/";
import { ActionContext, ActionBase } from "../ActionBase";
import { OrganizationActionBase } from "../AuthorizationActionBase";
import * as Exceptions from "../../infrastructure/exceptions/";
import * as Services from "../../services/";
import * as Repositories from "../../repositories";
import * as Entities from "../../entities/";
import { injectable, inject } from "inversify";

@injectable()
export class DeleteConversation extends OrganizationActionBase<boolean> {

  private conversationRepo: Repositories.IConversationRepository;

  constructor(@inject(Types.IConversationRepository) conversationRepo, @inject(Types.IOrganizationRepository) orgRepo) {
    super(orgRepo);
    this.conversationRepo = conversationRepo;
  };

  public async execute(context): Promise<boolean> {
    const conversation: Entities.IConversation = await this.conversationRepo.findOne({ id: context.params.conversationId, organizationId: context.params.organizationId });

    if (!conversation) {
      throw new Exceptions.EntityNotFoundException("conversation", { id: context.params.conversationId, organizationId: context.params.organizationId });
    }

    await this.conversationRepo.delete(conversation);

    return true;
  }

  protected getConstraints(): any {
    return {
      conversationId: "string|required",
    };
  }

  protected getSanitizationPattern(): any {
    return {};
  }
}