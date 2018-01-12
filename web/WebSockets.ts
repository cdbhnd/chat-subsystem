import * as socketsIO from "socket.io";

export class WebSockets {
    private webSockets;
    private authService;

    constructor(httpServer) {
       // this.authService = new AuthService();
        this.webSockets = socketsIO(httpServer);
        this.webSockets.on("connection", (socket) => {
            // this.ensureUserIsAuthenticated(socket);
        });
    }

    public boradcastMessage(topic, message): void {
        this.webSockets.emit(topic, message);
    }

    // public async ensureUserIsAuthenticated(socket): Promise<void> {
    //     let token = socket.handshake.query.token;
    //     let validUser = await this.authService.checkUser(token, [1, 2]);
    //     if (!validUser) {
    //         socket.disconnect();
    //     }
    // }
}
