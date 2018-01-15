import { IUser } from "../entities/";

export interface IUserRepository {
  find(query: any): Promise<IUser[]>;
  findOne(query: any): Promise<IUser>;
  findAll(): Promise<IUser[]>;
  create(data: IUser): Promise<IUser>;
  update(data: IUser): Promise<IUser>;
  delete(data: IUser): Promise<boolean>;
  findAndSort(query: any, sortQuery?: any, skipLimit?: any): Promise<IUser[]>;
}
