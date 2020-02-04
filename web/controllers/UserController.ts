import * as Actions from "../../actions";
import { ExceptionTypes } from "../../infrastructure/exceptions/";
import { JsonController, Param, Body, Get, Post, Put, Delete, Req, Res, HttpCode, UseBefore } from "routing-controllers";
import { ActionContext } from "../../actions";
import { OrgAuthMiddleware, QueryParserMiddleware} from "../middleware/";
import { HttpError, UseAction } from "../decorators/";

@JsonController()
export class UserController {

    @Get("/v1/organizations/:orgId/users")
    @HttpCode(200)
    @HttpError(403, ExceptionTypes.UserNotAuthorizedException)
    @HttpError(400, ExceptionTypes.ValidationException)
    @UseAction("GetUsers")
    @UseBefore(OrgAuthMiddleware)
    @UseBefore(QueryParserMiddleware)
    public async getUsers(@Param("orgKey") orgKey: any, @Param("orgId") orgId: string, @Param("query") query: any, action: Actions.IAction) {
        const actionContext = new ActionContext();
        actionContext.params = {
            orgKey: orgKey,
        };
        actionContext.query = query;
        return await action.run(actionContext);
    }

    @Post("/v1/organizations/:orgId/users")
    @HttpCode(200)
    @HttpError(403, ExceptionTypes.UserNotAuthorizedException)
    @HttpError(400, ExceptionTypes.ValidationException)
    @UseBefore(OrgAuthMiddleware)
    @UseAction("CreateUser")
    public async createUser(@Param("orgKey") orgKey: any, @Param("orgId") orgId: string, @Body() userSubmitedParams: any, action: Actions.IAction) {
        const actionContext = new ActionContext();
        actionContext.params = userSubmitedParams;
        actionContext.params.orgKey = orgKey;
        actionContext.params.organizationId = orgId;
        return await action.run(actionContext);
    }

    @Put("/v1/organizations/:orgId/users/:userId")
    @HttpCode(200)
    @HttpError(403, ExceptionTypes.UserNotAuthorizedException)
    @HttpError(400, ExceptionTypes.ValidationException)
    @UseBefore(OrgAuthMiddleware)
    @UseAction("UpdateUser")
    public async updateUser(@Param("orgKey") orgKey: any, @Param("orgId") orgId: string, @Param("userId") userId: string, @Body() userSubmitedParams: any, action: Actions.IAction) {
        const actionContext = new ActionContext();
        actionContext.params = userSubmitedParams;
        actionContext.params.orgKey = orgKey;
        actionContext.params.organizationId = orgId;
        actionContext.params.id = userId;
        return await action.run(actionContext);
    }

    @Get("/v1/organizations/:orgId/users/:id")
    @HttpCode(200)
    @HttpError(403, ExceptionTypes.UserNotAuthorizedException)
    @HttpError(400, ExceptionTypes.ValidationException)
    @HttpError(404, ExceptionTypes.EntityNotFoundException)
    @UseBefore(OrgAuthMiddleware)
    @UseAction("GetUserById")
    public async getConversation(@Param("orgKey") orgKey: any, @Param("orgId") orgId: string, @Param("id") userId: string, action: Actions.IAction) {
        const actionContext = new ActionContext();
        actionContext.params = {
            orgKey: orgKey,
            userId: userId,
            organizationId: orgId,
        };
        return await action.run(actionContext);
    }

    @Delete("/v1/organizations/:orgId/users/:id")
    @HttpCode(204)
    @HttpError(403, ExceptionTypes.UserNotAuthorizedException)
    @HttpError(400, ExceptionTypes.ValidationException)
    @HttpError(404, ExceptionTypes.EntityNotFoundException)
    @UseBefore(OrgAuthMiddleware)
    @UseAction("DeleteUser")
    public async deleteTherapist(@Param("orgKey") orgKey: any, @Param("orgId") orgId: string, @Param("id") userId: string, action: Actions.IAction) {
        const actionContext = new ActionContext();
        actionContext.params = {
            orgKey: orgKey,
            userId: userId,
            organizationId: orgId,
        };
        return await action.run(actionContext);
    }
}
