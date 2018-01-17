import {JsonController, Param, Body, Get, Post, Put, Delete, HttpCode, Res} from "routing-controllers";
import { HttpError, UseAction } from "../decorators/";
import { ValidationException, ExceptionTypes } from "../../infrastructure/exceptions/";

@JsonController()
export class PingController {

    @Get("/v1/ping")
    @HttpCode(200)
    @HttpError(400, ExceptionTypes.ValidationException)
    public async printHello() {
        throw new ValidationException(null, "a");
    }
}
