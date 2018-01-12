import { IScheduledTask } from "../entities";

export interface IScheduledTaskRepository {
    find(query: any): Promise<IScheduledTask[]>;
    findOne(query: any): Promise<IScheduledTask>;
    findAll(): Promise<IScheduledTask[]>;
    create(message: IScheduledTask): Promise<IScheduledTask>;
    update(message: IScheduledTask): Promise<IScheduledTask>;
    delete(message: IScheduledTask): Promise<Boolean>;
}
