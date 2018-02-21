import { Types, kernel } from "../../infrastructure/dependency-injection/";
import { ActionContext } from "../ActionBase";
import { OrganizationActionBase } from "../AuthorizationActionBase";
import * as Exceptions from "../../infrastructure/exceptions/";
import * as Services from "../../services/";
import * as Repositories from "../../repositories";
import * as Entities from "../../entities/";
import { injectable, inject } from "inversify";

@injectable()
export class UpdateConversation extends OrganizationActionBase<Entities.IConversation> {

  private conversationRepo: Repositories.IConversationRepository;

  constructor(@inject(Types.IConversationRepository) conversationRepo: Repositories.IConversationRepository,
              @inject(Types.IOrganizationRepository) orgRepo: Repositories.IOrganizationRepository) {
    super(orgRepo);
    this.conversationRepo = conversationRepo;
  }

  public async execute(context): Promise<Entities.IConversation> {
    const conversation: Entities.IConversation = context.params.company;

    conversation.name = context.params.name ? context.params.name : conversation.name;

    return await this.conversationRepo.update(conversation);
  }

  protected async onActionExecuting(context: ActionContext): Promise<ActionContext> {
    context = await super.onActionExecuting(context);

    const conversation: Entities.IConversation = await this.conversationRepo.findOne({ id: context.params.conversationId, organizationId: context.params.organizationId });

    if (!conversation) {
      throw new Exceptions.EntityNotFoundException("conversation", { id: context.params.conversationId, organizationId: context.params.organizationId });
    }

    context.params.company = conversation;
    delete context.params.comapnyId;

    return context;
  }

  protected getConstraints(): any {
    return {
      conversationId: "string|required",
      name: "string|required",
    };
  }

  protected getSanitizationPattern(): any {
    return {};
  }
}
