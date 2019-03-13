export interface IMessage {
    id: string;
    content: string;
    fromId: string;
    fromName: string;
    conversationId: string;
    timestamp: string;
    readers: string[];
    seenBy?: string[];
}
