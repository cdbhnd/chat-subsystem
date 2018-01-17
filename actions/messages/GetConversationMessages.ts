import { Types, kernel } from "../../infrastructure/dependency-injection/";
import { ActionContext, ActionBase } from "../ActionBase";
import { OrganizationActionBase } from "../AuthorizationActionBase";
import * as Exceptions from "../../infrastructure/exceptions/";
import * as Services from "../../services/";
import * as Repositories from "../../repositories";
import * as Entities from "../../entities/";
import { injectable, inject } from "inversify";

@injectable()
export class GetConversationMessages extends OrganizationActionBase<Entities.IMessage[]> {

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
    const conversation: Entities.IConversation = await this.conversationRepo.findOne({ id: context.params.conversationId, organizationId: context.params.organizationId });

    if (!conversation) {
      throw new Exceptions.EntityNotFoundException("conversation", { id: context.params.conversationId, organizationId: context.params.organizationId });
    }

    return await this.messageRepo.find({ conversationId: conversation.id });
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
