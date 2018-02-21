import { Types, kernel } from "../../infrastructure/dependency-injection/";
import { ActionContext, ActionBase } from "../ActionBase";
import { OrganizationActionBase } from "../AuthorizationActionBase";
import * as Exceptions from "../../infrastructure/exceptions/";
import * as Services from "../../services/";
import * as Repositories from "../../repositories";
import * as Entities from "../../entities/";
import { injectable, inject } from "inversify";

@injectable()
export class DeleteUser extends OrganizationActionBase<Entities.IUser> {

  private usersRepo: Repositories.IUserRepository;

  constructor(@inject(Types.IUserRepository) userRepo, @inject(Types.IOrganizationRepository) orgRepo) {
    super(orgRepo);
    this.usersRepo = userRepo;
  };

  public async execute(context): Promise<Entities.IUser> {
    const user: Entities.IUser = await this.usersRepo.findOne({ id: context.params.userId, organizationId: context.params.organizationId });

    if (!user) {
        throw new Exceptions.EntityNotFoundException("user", context.params.userId);
    }

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
