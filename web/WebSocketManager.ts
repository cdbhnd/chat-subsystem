import { EventAggregator } from "../infrastructure/eventEngine/EventAggregator";
import { IEventMediator } from "../infrastructure/eventEngine/IEventMediator";
import { EventListener } from "../infrastructure/eventEngine/EventListener";
import { WebSockets } from "./WebSockets";
import { Types, kernel } from "../infrastructure/dependency-injection/";
import { injectable, inject } from "inversify";
import { IMessageService } from "../services/EventService";

export class WebSocketManager {

    private sockets: WebSockets;

    constructor(webSocketServer: WebSockets) {
        this.sockets = webSocketServer;
        this.sockets.beforeRoomJoin = this.subscribeToConversation;
        this.monitorEvents();
    }

    private monitorEvents() {
        const eventMediator = EventAggregator.getMediator();
    }

    private passInformationToSockets(msg, data) {
        console.log("Pass info to sockets", msg, data);
        this.sockets.boradcastMessage(msg, data);
    }

    private subscribeToConversation(request: any, conversation: string) {
        const messageService: IMessageService = kernel.get<IMessageService>(Types.IMessageService);
        messageService.subscribeUserToConversation(request._query.user, conversation, (event: string, data: any) => {
            this.sockets.boradcastToRoom(conversation, event, data);
        });
    }
}
