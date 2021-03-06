import { EventAggregator } from "../infrastructure/eventEngine/EventAggregator";
import { IEventMediator } from "../infrastructure/eventEngine/IEventMediator";
import { EventListener } from "../infrastructure/eventEngine/EventListener";
import * as fs from "fs";
import * as path from "path";
import * as Actions from "../actions";
import {ActionContext} from "../actions";

export class EventListenersService {
    public eventsActionsConfig;

    constructor() {
        const parsedFile = JSON.parse(fs.readFileSync(path.join(__dirname, "./config.json"), "utf8"));
        this.eventsActionsConfig = parsedFile.events_handlers;
    }

    public init() {
        const eventMediator = EventAggregator.getMediator();
        for (const el of this.eventsActionsConfig) {
            eventMediator.subscribe(el.event, (event, data) => { this.monitorEvents(event, data); });
        }
    }

    private monitorEvents(event, data) {
        const actionsToExecute = this.eventsActionsConfig.filter((item) => {
            return item.event == event;
        });

        for (const el of actionsToExecute) {
            const actionToExecute = new Actions[el.action].Action();
            const actionContext = new ActionContext();
            actionContext.params = data;
            actionToExecute.run(actionContext);
        }
    }
}
