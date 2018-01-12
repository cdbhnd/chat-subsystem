import { IConversation } from "../entities/";

export interface IConversationRepository {
  find(query: any): Promise<IConversation[]>;
  findAndSort(query: any, sortQuery?: any, skipLimit?: any): Promise<IConversation[]>;
  findOne(query: any): Promise<IConversation>;
  findAll(): Promise<IConversation[]>;
  create(data: IConversation): Promise<IConversation>;
  update(data: IConversation): Promise<IConversation>;
  delete(data: IConversation): Promise<boolean>;
}
