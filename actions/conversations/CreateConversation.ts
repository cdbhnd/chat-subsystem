import { Types, kernel } from "../../infrastructure/dependency-injection/";
import { ActionContext, ActionBase } from "../ActionBase";
import { OrganizationActionBase } from "../AuthorizationActionBase";
import * as Exceptions from "../../infrastructure/exceptions/";
import * as Services from "../../services/";
import * as Repositories from "../../repositories";
import * as Entities from "../../entities/";
import { injectable, inject } from "inversify";

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
      name: context.params.name,
      organizationId: context.params.organizationId,
    };
    return await this.conversationRepo.create(conversation);
  }

  protected getConstraints(): any {
    return {
      name: "string|required",
      organizationId: "string|required",
    };
  }

  protected getSanitizationPattern(): any {
    return {};
  }
}
