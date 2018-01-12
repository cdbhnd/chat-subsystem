import { Types, kernel } from "../../infrastructure/dependency-injection/";
import { ActionContext, ActionBase } from "../ActionBase";
import { OrganizationActionBase } from "../AuthorizationActionBase";
import * as Exceptions from "../../infrastructure/exceptions/";
import * as Services from "../../services/";
import * as Repositories from "../../repositories";
import * as Entities from "../../entities/";
import { injectable, inject } from "inversify";

@injectable()
export class GetOrganizations extends OrganizationActionBase<Entities.IOrganization[]> {

  constructor(@inject(Types.IOrganizationRepository) orgRepo) {
    super(orgRepo);
  };

  public async execute(context): Promise<Entities.IOrganization[]> {
    if (context.query) {
      return await this.orgRepo.findAndSort(context.query, context.query.sortInfo, context.query.limitInfo);
    } else {
      return await this.orgRepo.findAll();
    }
  }

  protected getSanitizationPattern(): any {
    return {};
  }
}
