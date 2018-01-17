import * as Repos from "../repositories";
import * as Entities from "../entities";
import { injectable, inject } from "inversify";
import { BaseRepository } from "./BaseRepository";

@injectable()
export class Message extends BaseRepository<Entities.IMessage> implements Repos.IMessageRepository {

    constructor(@inject("entityName") entityName: string) {
        super(entityName);
    }

    protected getTextSearchFields(): string[] {
        return ["content", "fromName"];
    }
}
