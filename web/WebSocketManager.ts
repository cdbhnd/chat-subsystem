import { EventAggregator } from "../infrastructure/eventEngine/EventAggregator";
import { IEventMediator } from "../infrastructure/eventEngine/IEventMediator";
import { EventListener } from "../infrastructure/eventEngine/EventListener";
import { WebSockets } from "./WebSockets";

export class WebSocketManager {
    private sockets;

    constructor(webSocketServer) {
        this.sockets = webSocketServer;
        this.monitorEvents();
    }

    private monitorEvents() {
        const eventMediator = EventAggregator.getMediator();
        eventMediator.subscribe(EventAggregator.TEST_EVENT, this.passInformationToSockets.bind(this));
    }
    private passInformationToSockets(msg, data) {
        console.log("Pass info to sockets", msg, data);
        this.sockets.boradcastMessage(msg, data);
    }
}
