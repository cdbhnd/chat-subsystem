import * as express from "express";
import "./controllers/";
import { MapperRegistry } from "./mappers/Register";
import * as config from "config";
import { QueryParserMiddleware } from "./middleware/queryParserMiddleware";
import { corsMiddleware } from "./middleware/corsMiddleware";
import { useExpressServer } from "routing-controllers";
import  bodyParser = require("body-parser");
import "automapper-ts";

export class Server {
    private app: express.Application;

    constructor() {
        this.app = express();
        this.app.use(corsMiddleware);
        this.app.use(QueryParserMiddleware);
        this.app.use(express.static(String(config.get("asset_folder"))));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        useExpressServer(this.app);
    }

    public listen(port: number) {
        const expressApp: express.Application = this.app;
        const expresServerInstance = expressApp.listen(port);

        const mr: MapperRegistry = new MapperRegistry();
        mr.init();

        console.log("Application listening at port: " + port);
        return expresServerInstance;
    }
}
