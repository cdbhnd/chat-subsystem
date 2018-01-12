import {Controller, Param, Body, Get, Post, Put, Delete, HttpCode, Res} from "routing-controllers";

@Controller()
export class PingController {

    @Get("/v1/ping")
    @HttpCode(200)
    public async printHello() {
        return "Pong!!!";
    }
}
