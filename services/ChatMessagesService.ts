import { inject, injectable } from "inversify";
import { IMessage } from "../entities";
import { Types } from "../infrastructure/dependency-injection";
import * as Repositories from "../repositories";
import * as Services from "../services";
import * as Exceptions from "../infrastructure/exceptions";

@injectable()
export class ChatMessagesService implements Services.IChatMessagesService {
    constructor(@inject(Types.IMessageRepository) private messageRepo: Repositories.IMessageRepository) {}

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

    public async getMessagesFromMessageId(conversationId: string, messageId: string): Promise<IMessage[]> {
        const cursorMessage: IMessage = await this.messageRepo.findOne({
            conversationId: conversationId,
            id: messageId,
        });

        if (!cursorMessage) {
            throw new Exceptions.EntityNotFoundException(
                "message",
                { id: messageId },
                "Message with that id not found",
            );
        }

        const messages: IMessage[] = await this.messageRepo.findAndSort(
            {
                conversationId: conversationId,
                timestamp: { $gte: cursorMessage.timestamp },
            },
            { timestamp: -1 },
        );

        const completeMessages: IMessage[] = await this.messageRepo.findAndSort(
            {
                conversationId: conversationId,
                timestamp: { $lt: cursorMessage.timestamp },
            },
            { timestamp: -1 },
            { limit: 5, skip: 0 },
        );

        return messages.concat(completeMessages);
    }
}
