import { ActionContext, ActionBase } from "./ActionBase";
import { injectable, inject } from "inversify";
import * as Repositories from "../repositories";
import { Types, kernel } from "../infrastructure/dependency-injection/";
import * as Entities from "../entities/";
import * as Exceptions from "../infrastructure/exceptions/";
import * as config from "config";

@injectable()
export abstract class OrganizationActionBase<T> extends ActionBase<T> {

  protected orgRepo: Repositories.IOrganizationRepository;

  constructor(@inject(Types.IOrganizationRepository) orgRepo) {
    super();
    this.orgRepo = orgRepo;
  }

  protected async onActionExecuting(context: ActionContext): Promise<ActionContext> {
    const complexKey: string[] = context.params.orgKey;

    if (complexKey.length !== 2) {
      throw new Exceptions.OperationNotPermited(this.constructor.name);
    }

    const organization: Entities.IOrganization = await this.orgRepo.findOne({ id: complexKey[0] });

    if (!organization || organization.apiKey !== complexKey[1]) {
      throw new Exceptions.OperationNotPermited(this.constructor.name);
    }

    if (context.query) {
      context.query.organizationId = organization.id;
    }

    if (context.params) {
      context.params.organizationId = organization.id;
    }

    return context;
  }

  protected getConstraints(): any {
    return {
      orgKey: "required",
    };
  }
}

@injectable()
export abstract class AdminActionBase<T> extends ActionBase<T> {

  constructor() {
    super();
  }

  protected async onActionExecuting(context: ActionContext): Promise<ActionContext> {

    if (context.params.userId !== String(config.get("admin_key"))) {
      throw new Exceptions.OperationNotPermited(this.constructor.name);
    }

    return context;
  }

  protected getConstraints(): any {
    return {
      userId: "required",
    };
  }
}
