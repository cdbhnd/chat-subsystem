import * as schedule from "node-schedule";
import * as Actions from "../../actions";
import { IScheduledTaskRepository } from "../../repositories/";
import { IScheduledTask, IUser } from "../../entities/";
import { Types, kernel } from "../dependency-injection/";

/**
 * Create an instance of the single Task to be scheduled and executed at specific dateTime
 *
 * @param {ScheduledTask} scheduledTask
 * @param {Operator} user
 */
export class Task {

  private task: IScheduledTask;

  constructor(scheduledTask: IScheduledTask) {
    this.task = scheduledTask;
  }

  public async schedule(): Promise<schedule.Job> {
    return schedule.scheduleJob(new Date(this.task.date), async () => {
      const payload: any = JSON.parse(JSON.stringify(this.task.data));
      const actionToBeExecuted = new Actions[this.task.action].Action();
      const actionContext = new Actions.ActionContext();
      actionContext.params = payload;
      const scheduledTaskRepository: IScheduledTaskRepository = kernel.get<IScheduledTaskRepository>(Types.IScheduledTaskRepository);
      try {
        const result = await actionToBeExecuted.run(actionContext);
        this.task.log = JSON.stringify(result);
        this.task.success = true;
        this.task.executed = true;
      } catch (err) {
        this.task.log = JSON.stringify(err);
        this.task.error = true;
        this.task.executed = true;
      }
      scheduledTaskRepository.update(this.task);
    });
  }
}
