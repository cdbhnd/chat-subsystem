import { Types, kernel } from "../../infrastructure/dependency-injection/";
import { ActionContext, ActionBase } from "../ActionBase";
import { OrganizationActionBase } from "../AuthorizationActionBase";
import * as Exceptions from "../../infrastructure/exceptions/";
import * as Services from "../../services/";
import * as Repositories from "../../repositories";
import * as Entities from "../../entities/";
import { injectable, inject } from "inversify";

@injectable()
export class AddUserToConversation extends OrganizationActionBase<Entities.IUser> {

  private usersRepo: Repositories.IUserRepository;
  private conversationRepo: Repositories.IConversationRepository;

  constructor(@inject(Types.IUserRepository) userRepo,
              @inject(Types.IOrganizationRepository) orgRepo,
              @inject(Types.IConversationRepository) conversationRepo) {
    super(orgRepo);
    this.usersRepo = userRepo;
    this.conversationRepo = conversationRepo;
  };

  public async execute(context): Promise<Entities.IUser> {
    const user: Entities.IUser = await this.usersRepo.findOne({ id: context.params.userId, organizationId: context.params.organizationId });

    if (!user) {
        throw new Exceptions.EntityNotFoundException("user", context.params.userId);
    }

    const conversation: Entities.IConversation = await this.conversationRepo.findOne({ id: context.params.conversationId, organizationId: context.params.organizationId });

    if (!conversation) {
        throw new Exceptions.EntityNotFoundException("conversation", context.params.conversationId);
    }

    conversation.userIds.push(user.id);

    await this.conversationRepo.update(conversation);

    return user;
  }

  protected getSanitizationPattern(): any {
    return {
        userId: "string|required",
        conversationId: "string|required",
        organizationId: "string|required",
    };
  }
}
