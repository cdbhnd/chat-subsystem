import { Types, kernel } from "../../infrastructure/dependency-injection/";
import { ActionContext, ActionBase, IAction } from "../ActionBase";
import * as Exceptions from "../../infrastructure/exceptions/";
import * as Services from "../../services/";
import * as Repositories from "../../repositories";
import * as Entities from "../../entities/";
import { injectable, inject } from "inversify";
import * as Password from "../../utility/Password";

@injectable()
export class AuthenticateUser extends ActionBase<Entities.IUser> {

  private userRepo: Repositories.IUserRepository;

  constructor(@inject(Types.IUserRepository) userRepo: Repositories.IUserRepository) {
    super();
    this.userRepo = userRepo;
  }

  public async execute(context): Promise<Entities.IUser> {
    const user: Entities.IUser = await this.userRepo.findOne({ username: context.params.username });

    if (!user) {
      throw new Exceptions.InvalidCredentialsException(context.params.username, context.params.password);
    }

    const submitedPasswordValid: boolean = await Password.comparePassword(context.params.password, user.password);

    if (!submitedPasswordValid) {
      throw new Exceptions.InvalidCredentialsException(context.params.username, context.params.password);
    }

    return user;
  }

  protected async onActionExecuting(context: ActionContext): Promise<ActionContext> {
    return context;
  }

  protected async onActionExecuted(result: Entities.IUser): Promise<Entities.IUser> {
    return result;
  }

  protected getConstraints(): any {
    return {
      username: "required|string",
      password: "required|string",
    };
  }

  protected getSanitizationPattern(): any {
    return {};
  }
}
