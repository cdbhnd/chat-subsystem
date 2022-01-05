import { Types, kernel } from "../../infrastructure/dependency-injection/";
import { ActionContext, ActionBase } from "../ActionBase";
import { OrganizationActionBase } from "../AuthorizationActionBase";
import * as Exceptions from "../../infrastructure/exceptions/";
import * as Services from "../../services/";
import * as Repositories from "../../repositories";
import * as Entities from "../../entities/";
import { injectable, inject } from "inversify";
import { IConversationRepository, IMessageRepository, IOrganizationRepository } from "../../repositories";
import { IChatMessagesService } from "../../services/IChatMessagesService";

@injectable()
export class GetConversationMessages extends OrganizationActionBase<Entities.IMessage[]> {

  private conversationRepo: Repositories.IConversationRepository;
  private messageRepo: Repositories.IMessageRepository;

  constructor(
    @inject(Types.IConversationRepository) conversationRepo: IConversationRepository,
    @inject(Types.IOrganizationRepository) orgRepo: IOrganizationRepository,
    @inject(Types.IMessageRepository) messageRepo: IMessageRepository,
    @inject(Types.IChatMessagesService) private messageService: IChatMessagesService,
  ) {
    super(orgRepo);
    this.conversationRepo = conversationRepo;
    this.messageRepo = messageRepo;
  }

  public async execute(context: ActionContext): Promise<Entities.IMessage[]> {
    const conversation: Entities.IConversation = await this.conversationRepo.findOne({ id: context.params.conversationId, organizationId: context.params.organizationId });

    if (!conversation) {
      throw new Exceptions.EntityNotFoundException("conversation", { id: context.params.conversationId, organizationId: context.params.organizationId });
    }
    return await this.messageService.getAllMessages(conversation.id);
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
