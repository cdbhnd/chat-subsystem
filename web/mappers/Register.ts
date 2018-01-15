import "automapper-ts";

export class MapperRegistry {

  public init(): void {
    automapper
      .createMap("IUser", "UserModel")
      .forMember("password", (opts) => { opts.ignore(); });

    automapper
      .createMap("IOrganization", "OrganizationModel")
      .forMember("password", (opts) => { opts.ignore(); });
  }
}
