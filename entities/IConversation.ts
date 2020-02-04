export interface IConversation {
  id: string;
  name: string;
  organizationId: string;
  userIds: string[];
  image: string;
  lastMessage: string;
  lastMessageTimestamp: string;
}
