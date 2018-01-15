import { Types, kernel } from "../../infrastructure/dependency-injection/";
import { ActionContext, ActionBase } from "../ActionBase";
import { OrganizationActionBase } from "../AuthorizationActionBase";
import * as Exceptions from "../../infrastructure/exceptions/";
import * as Services from "../../services/";
import * as Repositories from "../../repositories";
import * as Entities from "../../entities/";
import { injectable, inject } from "inversify";

@injectable()
export class CreateMessage extends OrganizationActionBase<Entities.IMessage> {

  private messageRepo: Repositories.IMessageßRepository;
  private userRepo: Repositories.IUserRepository;

  constructor(@inject(Types.IMessageRepository) messagerepo: Repositories.IMessageßRepository,
              @inject(Types.IOrganizationRepository) orgRepo,
              @inject(Types.IUserRepository) userRepo: Repositories.IUserRepository) {
    super(orgRepo);
    this.messageRepo = messagerepo;
    this.userRepo = userRepo;
  }

  public async execute(context): Promise<Entities.IMessage> {
    const user: Entities.IUser = await this.userRepo.findOne({ id: context.params.fromId, organizationId: context.params.organizationId });

    if (!user) {
        throw new Exceptions.EntityNotFoundException("user", context.params.fromId);
    }

    const message: Entities.IMessage = {
      id: null,
      content: context.params.content,
      fromId: context.params.fromId,
      conversationId: context.params.conversationId,
      timestamp: new Date().toISOString(),
      fromName: user.nickname,
    };
    return await this.messageRepo.create(message);
  }

  protected getConstraints(): any {
    return {
      content: "string|required",
      fromId: "string|required",
      conversationId: "string|required",
    };
  }

  protected getSanitizationPattern(): any {
    return {};
  }
}
