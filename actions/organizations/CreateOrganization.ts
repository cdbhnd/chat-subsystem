import { Types, kernel } from "../../infrastructure/dependency-injection/";
import { ActionContext, ActionBase } from "../ActionBase";
import { OrganizationActionBase, AdminActionBase } from "../AuthorizationActionBase";
import * as Exceptions from "../../infrastructure/exceptions/";
import * as Services from "../../services/";
import * as Repositories from "../../repositories";
import * as Entities from "../../entities/";
import { injectable, inject } from "inversify";
import * as Password from "../../utility/Password";

@injectable()
export class CreateOrganization extends AdminActionBase<Entities.IOrganization> {

  private orgRepo: Repositories.IOrganizationRepository;

  constructor(@inject(Types.IOrganizationRepository) organizationRepo: Repositories.IOrganizationRepository) {
    super();
    this.orgRepo = organizationRepo;
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
      apiKey: this.guid(),
      hooks: [],
    };
    return await this.orgRepo.create(organization);
  }

  protected getConstraints(): any {
    return {
      firstName: "string|required",
      lastName: "string|required",
      email: "string|required",
      username: "string|required",
      password: "string|required",
      name: "string|required",
    };
  }

  protected getSanitizationPattern(): any {
    return {};
  }

  private guid(): string {
    const s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" +
      s4() + "-" + s4() + s4() + s4();
  }
}
