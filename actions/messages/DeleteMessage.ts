import { Types, kernel } from "../../infrastructure/dependency-injection/";
import { ActionContext, ActionBase } from "../ActionBase";
import { OrganizationActionBase } from "../AuthorizationActionBase";
import * as Exceptions from "../../infrastructure/exceptions/";
import * as Services from "../../services/";
import * as Repositories from "../../repositories";
import * as Entities from "../../entities/";
import { injectable, inject } from "inversify";

@injectable()
export class DeleteMessage extends OrganizationActionBase<Entities.IMessage> {

  private messageRepo: Repositories.IMessageRepository;

  constructor(@inject(Types.IMessageRepository) messagerepo: Repositories.IMessageRepository,
              @inject(Types.IOrganizationRepository) orgRepo) {
    super(orgRepo);
    this.messageRepo = messagerepo;
  }

  public async execute(context): Promise<Entities.IMessage> {
    const message: Entities.IMessage = await this.messageRepo.findOne({ id: context.params.messageId, conversationId: context.params.conversationId });

    if (!message) {
        throw new Exceptions.EntityNotFoundException("message", context.params.messageId);
    }

    await this.messageRepo.delete(message);

    return message;
  }

  protected getConstraints(): any {
    return {
      messageId: "string|required",
      conversationId: "string|required",
    };
  }

  protected getSanitizationPattern(): any {
    return {};
  }
}
