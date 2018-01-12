import { Types, kernel } from "../../infrastructure/dependency-injection/";
import { IEventMediator } from "./IEventMediator";

export class EventAggregator {

    public static TEST_EVENT: string = "TEST_EVENT";

    public static getMediator(): IEventMediator {
        return kernel.get<IEventMediator>(Types.EventMediator);
    }
}
