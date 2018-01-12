import { Types, kernel } from "../../infrastructure/dependency-injection/";
import { ActionContext } from "../ActionBase";
import { OrganizationActionBase } from "../AuthorizationActionBase";
import * as Exceptions from "../../infrastructure/exceptions/";
import * as Services from "../../services/";
import * as Repositories from "../../repositories";
import * as Entities from "../../entities/";
import { injectable, inject } from "inversify";
import * as Password from "../../utility/Password";

@injectable()
export class UpdateOrganization extends OrganizationActionBase<Entities.IOrganization> {

  constructor(@inject(Types.IOrganizationRepository) orgRepo: Repositories.IOrganizationRepository,
              @inject(Types.IUserRepository) userRepo: Repositories.IUserRepository) {
    super(orgRepo);
  }

  public async execute(context): Promise<Entities.IOrganization> {
    const organization: Entities.IOrganization = context.params.organization;

    organization.name = context.params.name ? context.params.name : organization.name;
    organization.firstName = context.params.firstName ? context.params.firstName : organization.firstName;
    organization.lastName = context.params.lastName ? context.params.lastName : organization.lastName;
    organization.email = context.params.email ? context.params.email : organization.email;
    organization.username = context.params.username ? context.params.username : organization.username;

    if (context.params.passwordChanged && context.params.password) {
      organization.password = await Password.generateHash(context.params.password);
    }

    return await this.orgRepo.update(organization);
  }

  protected async onActionExecuting(context: ActionContext): Promise<ActionContext> {
    context = await super.onActionExecuting(context);

    const organization: Entities.IOrganization = await this.orgRepo.findOne({ id: context.params.organizationId });

    if (!organization) {
      throw new Exceptions.EntityNotFoundException("organization", context.params.organizationId);
    }

    context.params.organization = organization;
    delete context.params.organizationId;

    return context;
  }

  protected getConstraints(): any {
    return {
      organizationId: "string|required",
      name: "string|required",
      firstName: "string|required",
      lastName: "string|required",
      email: "string|required",
      username: "string|required",
      active: "boolean|required",
      passwordChanged: "boolean",
      password: "string",
    };
  }

  protected getSanitizationPattern(): any {
    return {};
  }
}
