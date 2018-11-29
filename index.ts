import "reflect-metadata";
import { Server } from "./web/Server";
import "./web/middleware/globalMiddleware";
import {DB} from "./database/DB";
import {WebSockets} from "./web/WebSockets";
import {WebSocketManager} from "./web/WebSocketManager";
import { CronService } from "./infrastructure/cron/CronService";
import * as path from "path";
import * as Service from "./services";
import {EventListenersService} from "./event-handlers/EventListenersService";
import { Scheduler } from "./infrastructure/scheduler/";

// tslint:disable-next-line:no-string-literal
global["appRoot"] = path.resolve(__dirname);

const port: number = parseInt(process.env.PORT, 10) || 8080;
DB.init()
    .then(() => {
        // Initialize WebServer
        const server: Server = new Server();

        // Initialize WebSockets Server
        const webSocketsServer = new WebSockets(server.listen(port));
        const webSocketManger = new WebSocketManager(webSocketsServer);

        // Initialize Scheduler engine to collect all stored schedule actions form database and schedule thei execution again
        Scheduler.init();

        // Initialize Cron tasks
        CronService.init();

        // Initialize Event Handlers
        const eventListenerService = new EventListenersService();
        eventListenerService.init();
    });
