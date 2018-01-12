import "automapper-ts";

export class MapperRegistry {

  public init(): void {
    automapper
      .createMap("IUser", "UserModel")
      .forMember("password", (opts) => { opts.ignore(); });

    automapper
      .createMap("ITherapist", "TherapistModel")
      .forMember("password", (opts) => { opts.ignore(); });
  }
}
