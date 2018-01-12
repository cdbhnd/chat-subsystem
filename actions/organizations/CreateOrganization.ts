import { Types, kernel } from "../../infrastructure/dependency-injection/";
import { ActionContext, ActionBase } from "../ActionBase";
import { OrganizationActionBase } from "../AuthorizationActionBase";
import * as Exceptions from "../../infrastructure/exceptions/";
import * as Services from "../../services/";
import * as Repositories from "../../repositories";
import * as Entities from "../../entities/";
import { injectable, inject } from "inversify";
import * as Password from "../../utility/Password";

@injectable()
export class CreateOrganization extends OrganizationActionBase<Entities.IOrganization> {

  constructor(@inject(Types.IOrganizationRepository) organizationRepo: Repositories.IOrganizationRepository) {
    super(organizationRepo);
  }

  public async execute(context): Promise<Entities.IOrganization> {
    const organization: Entities.IOrganization = {
      id: null,
      name: context.params.name,
      email: context.params.email,
      username: context.params.username,
      password: await Password.generateHash(context.params.password),
      firstName: context.params.firstName,
      lastName: context.params.lastName,
      apiKey: null,
    };
    return await this.orgRepo.create(organization);
  }

  protected getConstraints(): any {
    return {
      firstName: "string|required",
      lastName: "string|required",
      email: "string|required",
      username: "string|required",
      active: "boolean|required",
      password: "string|required",
      name: "string|required",
    };
  }

  protected getSanitizationPattern(): any {
    return {};
  }
}
