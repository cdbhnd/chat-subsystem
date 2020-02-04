import { Types } from "../../infrastructure/dependency-injection/";
import { OrganizationActionBase } from "../AuthorizationActionBase";
import * as Repositories from "../../repositories";
import * as Entities from "../../entities/";
import { injectable, inject } from "inversify";
import { EntityNotFoundException } from "../../infrastructure/exceptions";

@injectable()
export class UpdateUser extends OrganizationActionBase<Entities.IUser> {

  private userRepo: Repositories.IUserRepository;

  constructor(@inject(Types.IUserRepository) userRepo: Repositories.IUserRepository, @inject(Types.IOrganizationRepository) orgRepo) {
    super(orgRepo);
    this.userRepo = userRepo;
  }

  public async execute(context): Promise<Entities.IUser> {
    const user = await this.userRepo.findOne({ id: context.params.id });
    if (!user) {
      throw new EntityNotFoundException("User", context.params.id);
    }
    user.firstName = context.params.firstName ? context.params.firstName : user.firstName;
    user.image = context.params.image ? context.params.image : user.image;
    user.lastName = context.params.lastName ? context.params.lastName : user.lastName;
    user.nickname = context.params.nickname ? context.params.nickname : user.nickname;

    return await this.userRepo.create(user);
  }

  protected getConstraints(): any {
    return {
      id: "string|required",
      firstName: "string",
      image: "string",
      lastName: "string",
      nickname: "string",
    };
  }

  protected getSanitizationPattern(): any {
    return {};
  }
}
