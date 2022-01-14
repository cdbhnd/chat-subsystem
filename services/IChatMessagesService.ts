import { IMessage } from "../entities";

export interface IChatMessagesService {
    getAllMessages(conversationId: string): Promise<IMessage[]>;
    getMessagesFeed(conversationId: string, cursor?: string, limit?: number): Promise<IMessage[]>;
    getMessagesFromMessageId(conversationId: string, messageId: string): Promise<IMessage[]>;
}
