import { Types, kernel } from "../../infrastructure/dependency-injection/";
import { ActionContext, ActionBase } from "../ActionBase";
import { OrganizationActionBase } from "../AuthorizationActionBase";
import * as Exceptions from "../../infrastructure/exceptions/";
import * as Services from "../../services/";
import * as Repositories from "../../repositories";
import * as Entities from "../../entities/";
import { injectable, inject } from "inversify";

@injectable()
export class GetUserConversations extends OrganizationActionBase<Entities.IConversation[]> {

  private conversationRepo: Repositories.IConversationRepository;

  constructor(@inject(Types.IConversationRepository) conversationRepo, @inject(Types.IOrganizationRepository) orgRepo) {
    super(orgRepo);
    this.conversationRepo = conversationRepo;
  };

  public async execute(context): Promise<Entities.IConversation[]> {
    return await this.conversationRepo.find({ organizationId: context.params.orgId, users: { $elemMatch: { id: context.params.userId } } });
  }

  protected getConstraints(): any {
    return {
      orgId: "string|required",
      userId: "string!required",
    };
  }

  protected getSanitizationPattern(): any {
    return {};
  }
}
