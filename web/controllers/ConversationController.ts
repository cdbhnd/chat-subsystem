import * as Actions from "../../actions";
import { ExceptionTypes } from "../../infrastructure/exceptions/";
import { JsonController, Param, Body, Get, Post, Put, Delete, Req, Res, HttpCode, UseBefore } from "routing-controllers";
import { ActionContext } from "../../actions";
import { AuthMiddleware, QueryParserMiddleware } from "../middleware/";
import * as jwt from "jwt-simple";
import * as config from "config";
import { HttpError, UseAction } from "../decorators/";
import { TransformResponse } from "../decorators/transform";
import { IUser } from "../../entities/";

@JsonController()
export class ConversationController {

    @Get("/v1/organizations/:orgId/conversations")
    @HttpCode(200)
    @HttpError(403, ExceptionTypes.UserNotAuthorizedException)
    @HttpError(400, ExceptionTypes.ValidationException)
    @UseAction("GetConversations")
    @UseBefore(AuthMiddleware)
    @UseBefore(QueryParserMiddleware)
    public async getConversations(@Param("userId") userId: any, @Param("orgId") orgId: string, @Param("query") query: any, action: Actions.IAction) {
        const actionContext = new ActionContext();
        actionContext.params = {
            userId: userId,
        };
        actionContext.query = query;
        actionContext.query.organizationId = orgId;
        return await action.run(actionContext);
    }

    @Post("/v1/organizations/:orgId/conversations")
    @HttpCode(200)
    @HttpError(403, ExceptionTypes.UserNotAuthorizedException)
    @HttpError(400, ExceptionTypes.ValidationException)
    @UseBefore(AuthMiddleware)
    @UseAction("CreateConversation")
    public async createConversation(@Param("userId") userId: any, @Param("orgId") orgId: string, @Body() userSubmitedParams: any, action: Actions.IAction) {
        const actionContext = new ActionContext();
        actionContext.params = userSubmitedParams;
        actionContext.params.userId = userId;
        actionContext.params.organizationId = orgId;
        return await action.run(actionContext);
    }

    @Get("/v1/organizations/:orgId/conversations/:id")
    @HttpCode(200)
    @HttpError(403, ExceptionTypes.UserNotAuthorizedException)
    @HttpError(400, ExceptionTypes.ValidationException)
    @HttpError(404, ExceptionTypes.EntityNotFoundException)
    @UseBefore(AuthMiddleware)
    @UseAction("GetConversationById")
    public async getConversation(@Param("userId") userId: any, @Param("orgId") orgId: string, @Param("id") conversationId: string, action: Actions.IAction) {
        const actionContext = new ActionContext();
        actionContext.params = {
            userId: userId,
            conversationId: conversationId,
            organizationId: orgId,
        };
        return await action.run(actionContext);
    }

    @Put("/v1/organizations/:orgId/conversations/:id")
    @HttpCode(200)
    @HttpError(403, ExceptionTypes.UserNotAuthorizedException)
    @HttpError(400, ExceptionTypes.ValidationException)
    @HttpError(404, ExceptionTypes.EntityNotFoundException)
    @UseBefore(AuthMiddleware)
    @UseAction("UpdateConversation")
    public async updateConversation(@Body() userSubmitedParams: any, @Param("userId") userId: any, @Param("orgId") orgId: string, @Param("id") conversationId: string, action: Actions.IAction) {
        const actionContext = new ActionContext();
        actionContext.params = userSubmitedParams;
        actionContext.params.userId = userId;
        actionContext.params.conversationId = conversationId;
        actionContext.params.organizationId = orgId;
        return await action.run(actionContext);
    }

    @Delete("/v1/organizations/:orgId/conversations/:id")
    @HttpCode(204)
    @HttpError(403, ExceptionTypes.UserNotAuthorizedException)
    @HttpError(400, ExceptionTypes.ValidationException)
    @HttpError(404, ExceptionTypes.EntityNotFoundException)
    @UseBefore(AuthMiddleware)
    @UseAction("DeleteCompany")
    public async deleteTherapist(@Param("userId") userId: any, @Param("orgId") orgId: string, @Param("id") conversationId: string, action: Actions.IAction) {
        const actionContext = new ActionContext();
        actionContext.params = {
            userId: userId,
            companyId: conversationId,
            organizationId: orgId,
        };
        return await action.run(actionContext);
    }
}
