import { Types, kernel } from "../../infrastructure/dependency-injection/";
import { ActionContext, ActionBase } from "../ActionBase";
import { OrganizationActionBase } from "../AuthorizationActionBase";
import * as Exceptions from "../../infrastructure/exceptions/";
import * as Services from "../../services/";
import * as Repositories from "../../repositories";
import * as Entities from "../../entities/";
import { injectable, inject } from "inversify";

@injectable()
export class CreateUser extends OrganizationActionBase<Entities.IUser> {

  private userRepo: Repositories.IUserRepository;

  constructor(@inject(Types.IUserRepository) userRepo: Repositories.IUserRepository, @inject(Types.IOrganizationRepository) orgRepo) {
    super(orgRepo);
    this.userRepo = userRepo;
  }

  public async execute(context): Promise<Entities.IUser> {
    const user: Entities.IUser = {
      id: null,
      firstName: context.params.firstName,
      lastName: context.params.lastName,
      nickname: context.params.nickname,
      organizationId: context.params.organizationId,
    };
    return await this.userRepo.create(user);
  }

  protected getConstraints(): any {
    return {
      firstName: "string|required",
      lastName: "string|required",
      nickname: "string|required",
      organizationId: "string|required",
    };
  }

  protected getSanitizationPattern(): any {
    return {};
  }
}
