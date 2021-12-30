import { inject, injectable } from "inversify";
import { IMessage } from "../entities";
import { Types } from "../infrastructure/dependency-injection";
import * as Repositories from "../repositories";
import * as Services from "../services";

@injectable()
export class ChatMessagesService implements Services.IChatMessagesService {
    constructor(
        @inject(Types.IMessageRepository) private messageRepo: Repositories.IMessageRepository,
        @inject(Types.IUserRepository) private userRepo: Repositories.IUserRepository,
    ) {}

    public async getAllMessages(conversationId: string): Promise<IMessage[]> {
        return await this.messageRepo.find({ conversationId: conversationId });
    }

    public async getMessagesFeed(conversationId: string, cursor: string, limit: number): Promise<IMessage[]> {
        const messages: IMessage[] = await this.messageRepo.findAndSort(
            { conversationId: conversationId, timestamp: { $lt: cursor } },
            { timestamp: -1 },
            { limit: limit, skip: 0 },
        );
        return messages;
    }
}
