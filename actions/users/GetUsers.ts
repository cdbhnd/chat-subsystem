import { Types, kernel } from "../../infrastructure/dependency-injection/";
import { ActionContext, ActionBase } from "../ActionBase";
import { OrganizationActionBase } from "../AuthorizationActionBase";
import * as Exceptions from "../../infrastructure/exceptions/";
import * as Services from "../../services/";
import * as Repositories from "../../repositories";
import * as Entities from "../../entities/";
import { injectable, inject } from "inversify";

@injectable()
export class GetUsers extends OrganizationActionBase<Entities.IUser[]> {

  private usersRepo: Repositories.IUserRepository;

  constructor(@inject(Types.IUserRepository) userRepo, @inject(Types.IOrganizationRepository) orgRepo) {
    super(orgRepo);
    this.usersRepo = userRepo;
  };

  public async execute(context): Promise<Entities.IUser[]> {
    if (context.query) {
      return await this.usersRepo.findAndSort(context.query, context.query.sortInfo, context.query.limitInfo);
    } else {
      return await this.usersRepo.findAll();
    }
  }

  protected getSanitizationPattern(): any {
    return {};
  }
}
