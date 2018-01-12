import * as schedule from "node-schedule";
import { IScheduledTaskRepository } from "../../repositories/";
import { IScheduledTask, IUser } from "../../entities/";
import { Task } from "./Task";
import { Types, kernel } from "../../infrastructure/dependency-injection/";

export class Scheduler {

  public static async init(): Promise<boolean> {
    const scheduledTasks: IScheduledTask[] = await this.getScheduleRepository().find({ executed: false });
    for (let i = 0; i < scheduledTasks.length; i++) {
      await this.scheduleExecution(scheduledTasks[i]);
    }
    return true;
  }

  public static async create(name: string, action: string, date: Date, data: any): Promise<boolean> {
    let newScheduledTask: IScheduledTask = {
      action: action,
      data: data,
      date: date.toISOString(),
      error: false,
      executed: false,
      log: null,
      name: name,
      success: false,
      type: "action",
    };
    newScheduledTask = await this.getScheduleRepository().create(newScheduledTask);
    await this.scheduleExecution(newScheduledTask);
    return true;
  }

  public static async get(action: string, date: Date, data: any): Promise<IScheduledTask> {
    return await this.getScheduleRepository().findOne({
      action: action,
      type: "action",
      data: data,
      date: date.toISOString(),
    });
  }

  private static scheduledJobs: schedule.Job[] = [];

  private static getScheduleRepository(): IScheduledTaskRepository {
    return kernel.get<IScheduledTaskRepository>(Types.IScheduledTaskRepository);
  }

  private static async scheduleExecution(scheduledTask: IScheduledTask) {
    const newTask: Task = new Task(scheduledTask);
    this.scheduledJobs.push(await newTask.schedule());
  }
}
