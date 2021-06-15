import { EventAggregator } from "../infrastructure/eventEngine/EventAggregator";
import { IEventMediator } from "../infrastructure/eventEngine/IEventMediator";
import { EventListener } from "../infrastructure/eventEngine/EventListener";
import { WebSockets } from "./WebSockets";
import { Types, kernel } from "../infrastructure/dependency-injection/";
import { injectable, inject } from "inversify";
import { IMessageService } from "../services/EventService";

export class WebSocketManager {

    public static sockets: WebSockets;

    constructor(webSocketServer: WebSockets) {
        WebSocketManager.sockets = webSocketServer;
        WebSocketManager.sockets.beforeRoomJoin = this.subscribeToConversation;
        this.monitorEvents();
    }

    private monitorEvents() {
        const eventMediator = EventAggregator.getMediator();
    }

    private passInformationToSockets(msg, data) {
        console.log("Pass info to sockets", msg, data);
        WebSocketManager.sockets.boradcastMessage(msg, data);
    }

    private subscribeToConversation(request: any, conversation: string) {
        const messageService: IMessageService = kernel.get<IMessageService>(Types.IMessageService);
        // const socketRef = this.sockets;
        messageService.subscribeUserToConversation(request._query.user, conversation.split("_")[0], (event: string, data: any) => {
            console.log(event + ": " + data.message.conversationId + "_" + data.userId + " - " + data.message);
            WebSocketManager.sockets.boradcastToRoom(data.message.conversationId + "_" + data.userId, event, data.message);
        });
    }
}
