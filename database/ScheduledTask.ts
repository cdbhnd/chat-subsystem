import * as Repos from "../repositories";
import * as Entities from "../entities";
import { injectable, inject } from "inversify";
import { BaseRepository } from "./BaseRepository";

@injectable()
export class ScheduledTask extends BaseRepository<Entities.IScheduledTask> implements Repos.IScheduledTaskRepository {

    constructor(@inject("entityName") entityName: string) {
        super(entityName);
    }
}
