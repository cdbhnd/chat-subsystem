export interface IConversation {
  id: string;
  name: string;
  organizationId: string;
  users: IConversationUser[];
  image: string;
  lastMessage: string;
  type: ConversationType;
  lastMessageTimestamp: string;
}

export interface IConversationUser {
  id: string;
  name: string;
  image: string;
}

export enum ConversationType {
  PRIVATE = "private",
  PUBLIC = "public",
  DIRECT = "direct",
}
