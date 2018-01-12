import * as Cron from "cron";
import { Types, kernel } from "../dependency-injection/";
import {ICronTask} from "./tasks/";

export class CronService {

    public static cronePackage = Cron;

    public static init() {
        CronService.activateCronTasks();
    }

    public static activateCronTasks() {
        const allCroneTasks = this.tryToresolveCronTasks();
        for (const cronTask of allCroneTasks) {
            // tslint:disable-next-line:no-unused-new
            new CronService.cronePackage.CronJob(cronTask.occurancePattern, async () => {
                console.log(cronTask.message + "started at: " + new Date().toISOString());
                await cronTask.callback();
            }, null, true);
        }
    }

    private static tryToresolveCronTasks(): ICronTask[] {
        try {
            return kernel.getAll<ICronTask>(Types.ICronTask);
        } catch (err) {
            return [];
        }
    }
}
