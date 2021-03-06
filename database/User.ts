import * as Repos from "../repositories";
import * as Entities from "../entities";
import { injectable, inject } from "inversify";
import { BaseRepository } from "./BaseRepository";

@injectable()
export class User extends BaseRepository<Entities.IUser> implements Repos.IUserRepository {

    constructor(@inject("entityName") entityName: string) {
        super(entityName);
    }
}
