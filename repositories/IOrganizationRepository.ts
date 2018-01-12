import { IOrganization } from "../entities/";

export interface IOrganizationRepository {
  find(query: any): Promise<IOrganization[]>;
  findAndSort(query: any, sortQuery?: any, skipLimit?: any): Promise<IOrganization[]>;
  findOne(query: any): Promise<IOrganization>;
  findAll(): Promise<IOrganization[]>;
  create(data: IOrganization): Promise<IOrganization>;
  update(data: IOrganization): Promise<IOrganization>;
  delete(data: IOrganization): Promise<boolean>;
}
