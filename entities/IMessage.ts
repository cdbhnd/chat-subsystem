import { IConversationUser } from "./IConversation";

export interface IMessage {
    id: string;
    content: string;
    type?: string;
    fromId: string;
    fromName: string;
    conversationId: string;
    conversationName: string;
    timestamp: string;
    readers: string[];
    seenBy?: string[];
    likedBy?: IConversationUser[];
    replyTo?: IMessage;
}
