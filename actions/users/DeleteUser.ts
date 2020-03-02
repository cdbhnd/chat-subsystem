import { Types } from "../../infrastructure/dependency-injection/";
import { OrganizationActionBase } from "../AuthorizationActionBase";
import * as Exceptions from "../../infrastructure/exceptions/";
import * as Repositories from "../../repositories";
import * as Entities from "../../entities/";
import { injectable, inject } from "inversify";

@injectable()
export class DeleteUser extends OrganizationActionBase<Entities.IUser> {

  private usersRepo: Repositories.IUserRepository;
  private conversationRepo: Repositories.IConversationRepository;

  constructor(
    @inject(Types.IUserRepository) userRepo,
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

    await this.conversationRepo.collection().update({ "users.id": user.id }, { $pull: { users: { id: user.id } } }, { multi: true });

    await this.usersRepo.delete(user);

    return user;
  }

  protected getConstraints(): any {
    return {
      userId: "string|required",
    };
  }

  protected getSanitizationPattern(): any {
    return {};
  }
}
