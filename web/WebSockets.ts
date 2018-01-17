import * as socketsIO from "socket.io";

export class WebSockets {

    public beforeRoomJoin: (request: any, room: string) => void;

    private webSockets;
    private authService;

    constructor(httpServer) {
        this.webSockets = socketsIO(httpServer);
        this.webSockets.on("connection", (socket) => {
            socket.on("room", (room) => {
                this.beforeRoomJoin(socket.request, room);
                socket.join(room);
            });
        });
    }

    public boradcastMessage(topic, message): void {
        this.webSockets.emit(topic, message);
    }

    public boradcastToRoom(room: string, event: string, message: any): void {
        this.webSockets.in(room).emit(event, message);
    }

}
