import { Types, kernel } from "../../infrastructure/dependency-injection/";
import { ActionContext, ActionBase } from "../ActionBase";
import * as Exceptions from "../../infrastructure/exceptions/";
import * as Services from "../../services/";
import * as Repositories from "../../repositories";
import * as Entities from "../../entities/";
import { injectable, inject } from "inversify";
import * as Password from "../../utility/Password";

@injectable()
export class AuthenticateOrganization extends ActionBase<Entities.IOrganization> {

  private orgRepo: Repositories.IOrganizationRepository;

  constructor(@inject(Types.IOrganizationRepository) organizationRepo: Repositories.IOrganizationRepository) {
    super();
    this.orgRepo = organizationRepo;
  }

  public async execute(context): Promise<Entities.IOrganization> {
    const organization: Entities.IOrganization = await this.orgRepo.findOne({ username: context.params.username });

    if (!organization) {
      throw new Exceptions.InvalidCredentialsException(context.params.username, context.params.password);
    }

    const passwordValid: boolean = await Password.comparePassword(context.params.password, organization.password);

    if (!passwordValid) {
      throw new Exceptions.InvalidCredentialsException(context.params.username, context.params.password);
    }

    return organization;
  }

  protected getConstraints(): any {
    return {
      username: "string|required",
      password: "string|required",
    };
  }

  protected getSanitizationPattern(): any {
    return {};
  }
}
