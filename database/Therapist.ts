import * as Repos from "../repositories";
import * as Entities from "../entities";
import { injectable, inject } from "inversify";
import { BaseRepository } from "./BaseRepository";

@injectable()
export class Organization extends BaseRepository<Entities.IOrganization> implements Repos.IOrganizationRepository {

    constructor(@inject("entityName") entityName: string) {
        super(entityName);
    }

    protected getTextSearchFields(): string[] {
        return ["firstName", "lastName", "username"];
    }
}
