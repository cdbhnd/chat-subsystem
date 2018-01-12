import * as Actions from "../../actions";
import { ExceptionTypes } from "../../infrastructure/exceptions/";
import { JsonController, Param, Body, Get, Post, Put, Delete, Req, Res, HttpCode, UseBefore } from "routing-controllers";
import { ActionContext } from "../../actions";
import { AuthMiddleware } from "../middleware/authMiddleware";
import * as jwt from "jwt-simple";
import * as config from "config";
import { HttpError, UseAction } from "../decorators/";
import { TransformResponse } from "../decorators/transform";
import { IUser } from "../../entities/";

@JsonController()
export class UserController {

    @Post("/v1/admin/token")
    @HttpCode(200)
    @HttpError(401, ExceptionTypes.InvalidCredentialsException)
    @HttpError(400, ExceptionTypes.ValidationException)
    @UseAction("AuthenticateUser")
    @TransformResponse("IUser", "UserModel")
    public async login(@Body() userSubmitedParams: any, action: Actions.IAction) {
        const actionContext = new ActionContext();
        actionContext.params = userSubmitedParams;
        const userFromDb = await action.run(actionContext);
        const secret: string = String(config.get("secret"));
        userFromDb.token = jwt.encode({ authUserId: userFromDb.id }, secret);
        return userFromDb;
    }
}
