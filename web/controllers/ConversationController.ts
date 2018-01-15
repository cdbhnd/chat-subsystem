import * as Actions from "../../actions";
import { ExceptionTypes } from "../../infrastructure/exceptions/";
import { JsonController, Param, Body, Get, Post, Put, Delete, Req, Res, HttpCode, UseBefore } from "routing-controllers";
import { ActionContext } from "../../actions";
import { OrgAuthMiddleware, QueryParserMiddleware } from "../middleware/";
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
    @UseBefore(OrgAuthMiddleware)
    @UseBefore(QueryParserMiddleware)
    public async getConversations(@Param("orgKey") orgKey: any, @Param("orgId") orgId: string, @Param("query") query: any, action: Actions.IAction) {
        const actionContext = new ActionContext();
        actionContext.params = {
            orgKey: orgKey,
        };
        actionContext.query = query;
        actionContext.query.organizationId = orgId;
        return await action.run(actionContext);
    }

    @Post("/v1/organizations/:orgId/conversations")
    @HttpCode(200)
    @HttpError(403, ExceptionTypes.UserNotAuthorizedException)
    @HttpError(400, ExceptionTypes.ValidationException)
    @UseBefore(OrgAuthMiddleware)
    @UseAction("CreateConversation")
    public async createConversation(@Param("orgKey") orgKey: any, @Param("orgId") orgId: string, @Body() userSubmitedParams: any, action: Actions.IAction) {
        const actionContext = new ActionContext();
        actionContext.params = userSubmitedParams;
        actionContext.params.orgKey = orgKey;
        actionContext.params.organizationId = orgId;
        return await action.run(actionContext);
    }

    @Get("/v1/organizations/:orgId/conversations/:id")
    @HttpCode(200)
    @HttpError(403, ExceptionTypes.UserNotAuthorizedException)
    @HttpError(400, ExceptionTypes.ValidationException)
    @HttpError(404, ExceptionTypes.EntityNotFoundException)
    @UseBefore(OrgAuthMiddleware)
    @UseAction("GetConversationById")
    public async getConversation(@Param("orgKey") orgKey: any, @Param("orgId") orgId: string, @Param("id") conversationId: string, action: Actions.IAction) {
        const actionContext = new ActionContext();
        actionContext.params = {
            orgKey: orgKey,
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
    @UseBefore(OrgAuthMiddleware)
    @UseAction("UpdateConversation")
    public async updateConversation(@Body() userSubmitedParams: any, @Param("orgKey") orgKey: any, @Param("orgId") orgId: string, @Param("id") conversationId: string, action: Actions.IAction) {
        const actionContext = new ActionContext();
        actionContext.params = userSubmitedParams;
        actionContext.params.orgKey = orgKey;
        actionContext.params.conversationId = conversationId;
        actionContext.params.organizationId = orgId;
        return await action.run(actionContext);
    }

    @Post("/v1/organizations/:orgId/conversations/:id/users")
    @HttpCode(200)
    @HttpError(403, ExceptionTypes.UserNotAuthorizedException)
    @HttpError(400, ExceptionTypes.ValidationException)
    @HttpError(404, ExceptionTypes.EntityNotFoundException)
    @UseBefore(OrgAuthMiddleware)
    @UseAction("AddUserToConversation")
    public async AddUserToConversation(@Body() userSubmitedParams: any, @Param("orgKey") orgKey: any, @Param("orgId") orgId: string, @Param("id") conversationId: string, action: Actions.IAction) {
        const actionContext = new ActionContext();
        actionContext.params = userSubmitedParams;
        actionContext.params.orgKey = orgKey;
        actionContext.params.conversationId = conversationId;
        actionContext.params.organizationId = orgId;
        return await action.run(actionContext);
    }

    @Delete("/v1/organizations/:orgId/conversations/:id/users")
    @HttpCode(200)
    @HttpError(403, ExceptionTypes.UserNotAuthorizedException)
    @HttpError(400, ExceptionTypes.ValidationException)
    @HttpError(404, ExceptionTypes.EntityNotFoundException)
    @UseBefore(OrgAuthMiddleware)
    @UseAction("RemoveUserFromConversation")
    public async RemoveUserFromConversation(@Body() userSubmitedParams: any, @Param("orgKey") orgKey: any, @Param("orgId") orgId: string, @Param("id") conversationId: string, action: Actions.IAction) {
        const actionContext = new ActionContext();
        actionContext.params = userSubmitedParams;
        actionContext.params.orgKey = orgKey;
        actionContext.params.conversationId = conversationId;
        actionContext.params.organizationId = orgId;
        return await action.run(actionContext);
    }

    @Delete("/v1/organizations/:orgId/conversations/:id")
    @HttpCode(204)
    @HttpError(403, ExceptionTypes.UserNotAuthorizedException)
    @HttpError(400, ExceptionTypes.ValidationException)
    @HttpError(404, ExceptionTypes.EntityNotFoundException)
    @UseBefore(OrgAuthMiddleware)
    @UseAction("DeleteCompany")
    public async deleteTherapist(@Param("orgKey") orgKey: any, @Param("orgId") orgId: string, @Param("id") conversationId: string, action: Actions.IAction) {
        const actionContext = new ActionContext();
        actionContext.params = {
            orgKey: orgKey,
            conversationId: conversationId,
            organizationId: orgId,
        };
        return await action.run(actionContext);
    }
}
