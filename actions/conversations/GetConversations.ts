import { Types, kernel } from "../../infrastructure/dependency-injection/";
import { ActionContext, ActionBase } from "../ActionBase";
import { OrganizationActionBase } from "../AuthorizationActionBase";
import * as Exceptions from "../../infrastructure/exceptions/";
import * as Services from "../../services/";
import * as Repositories from "../../repositories";
import * as Entities from "../../entities/";
import { injectable, inject } from "inversify";

@injectable()
export class GetConversations extends OrganizationActionBase<Entities.IConversation[]> {

  private conversationRepo: Repositories.IConversationRepository;

  constructor(@inject(Types.IConversationRepository) conversationRepo, @inject(Types.IOrganizationRepository) orgRepo) {
    super(orgRepo);
    this.conversationRepo = conversationRepo;
  };

  public async execute(context): Promise<Entities.IConversation[]> {
    if (context.query) {
      return await this.conversationRepo.findAndSort(context.query, context.query.sortInfo, context.query.limitInfo);
    } else {
      return await this.conversationRepo.findAll();
    }
  }

  protected getSanitizationPattern(): any {
    return {};
  }
}
