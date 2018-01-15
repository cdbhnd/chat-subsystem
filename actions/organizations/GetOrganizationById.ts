import { Types, kernel } from "../../infrastructure/dependency-injection/";
import { ActionContext, ActionBase } from "../ActionBase";
import { AdminActionBase } from "../AuthorizationActionBase";
import * as Exceptions from "../../infrastructure/exceptions/";
import * as Services from "../../services/";
import * as Repositories from "../../repositories";
import * as Entities from "../../entities/";
import { injectable, inject } from "inversify";

@injectable()
export class GetOrganizationById extends AdminActionBase<Entities.IOrganization> {

  private orgRepo: Repositories.IOrganizationRepository;

  constructor(@inject(Types.IOrganizationRepository) orgRepo, @inject(Types.IUserRepository) userRepo) {
    super();
    this.orgRepo = orgRepo;
  };

  public async execute(context): Promise<Entities.IOrganization> {
    const organization: Entities.IOrganization = await this.orgRepo.findOne({ id: context.params.organizationId });

    if (!organization) {
      throw new Exceptions.EntityNotFoundException("organization", context.params.organizationId);
    }

    return organization;
  }

  protected getConstraints(): any {
    return {
      organizationId: "string|required",
    };
  }

  protected getSanitizationPattern(): any {
    return {};
  }
}
