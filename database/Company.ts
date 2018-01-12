import * as Repos from "../repositories";
import * as Entities from "../entities";
import { injectable, inject } from "inversify";
import { BaseRepository } from "./BaseRepository";

@injectable()
export class Conversation extends BaseRepository<Entities.IConversation> implements Repos.IConversationRepository {

    constructor(@inject("entityName") entityName: string) {
        super(entityName);
    }

    protected getTextSearchFields(): string[] {
        return ["name"];
    }
}
