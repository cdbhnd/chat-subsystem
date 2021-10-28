import { Types, kernel } from "../../infrastructure/dependency-injection/";
import { IEventMediator } from "./IEventMediator";

export class EventAggregator {

    public static NEW_MESSAGE: string = "NEW_MESSAGE";
    public static READ_MESSAGE: string = "READ_MESSAGE";
    public static MESSAGE_LIKED: string = "MESSAGE_LIKED";
    public static READ_CONVERSATION_MESSAGES: string = "READ_CONVERSATION_MESSAGES";

    public static getMediator(): IEventMediator {
        return kernel.get<IEventMediator>(Types.EventMediator);
    }
}
