import { IMessage } from "../entities/";

export interface IMessageßRepository {
  find(query: any): Promise<IMessage[]>;
  findAndSort(query: any, sortQuery?: any, skipLimit?: any): Promise<IMessage[]>;
  findOne(query: any): Promise<IMessage>;
  findAll(): Promise<IMessage[]>;
  create(data: IMessage): Promise<IMessage>;
  update(data: IMessage): Promise<IMessage>;
  delete(data: IMessage): Promise<boolean>;
}
