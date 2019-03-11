import * as Actions from "../../actions";
import { ExceptionTypes } from "../../infrastructure/exceptions/";
import { JsonController, Param, Body, Get, Post, Put, Delete, Req, Res, HttpCode, UseBefore } from "routing-controllers";
import { ActionContext } from "../../actions";
import { OrgAuthMiddleware } from "../middleware/";
import { HttpError, UseAction } from "../decorators/";

@JsonController()
export class MessageController {

    @Get("/v1/conversations/:userId/new-messages")
    @HttpCode(200)
    @HttpError(403, ExceptionTypes.UserNotAuthorizedException)
    @HttpError(400, ExceptionTypes.ValidationException)
    @UseAction("GetNewMessages")
    @UseBefore(OrgAuthMiddleware)
    public async getNewMessages(@Param("orgKey") orgKey: any, @Param("userId") userId: string, action: Actions.IAction) {
        const actionContext = new ActionContext();
        actionContext.params = {
            orgKey: orgKey,
            userId: userId,
        };
        return await action.run(actionContext);
    }

    @Get("/v1/conversations/:conversationId/messages")
    @HttpCode(200)
    @HttpError(403, ExceptionTypes.UserNotAuthorizedException)
    @HttpError(400, ExceptionTypes.ValidationException)
    @UseAction("GetConversationMessages")
    @UseBefore(OrgAuthMiddleware)
    public async getMessages(@Param("orgKey") orgKey: any, @Param("conversationId") conversationId: string, action: Actions.IAction) {
        const actionContext = new ActionContext();
        actionContext.params = {
            orgKey: orgKey,
            conversationId: conversationId,
        };
        return await action.run(actionContext);
    }

    @Post("/v1/conversations/:conversationId/messages")
    @HttpCode(200)
    @HttpError(403, ExceptionTypes.UserNotAuthorizedException)
    @HttpError(400, ExceptionTypes.ValidationException)
    @HttpError(404, ExceptionTypes.EntityNotFoundException)
    @UseBefore(OrgAuthMiddleware)
    @UseAction("CreateMessage")
    public async createMessage(@Param("orgKey") orgKey: any, @Param("conversationId") conversationId: string, @Body() userSubmitedParams: any, action: Actions.IAction) {
        const actionContext = new ActionContext();
        actionContext.params = userSubmitedParams;
        actionContext.params.orgKey = orgKey;
        actionContext.params.conversationId = conversationId;
        return await action.run(actionContext);
    }

    @Post("/v1/conversations/:conversationId/messages/:id")
    @HttpCode(200)
    @HttpError(403, ExceptionTypes.UserNotAuthorizedException)
    @HttpError(400, ExceptionTypes.ValidationException)
    @UseBefore(OrgAuthMiddleware)
    @UseAction("DeleteMessage")
    public async deleteMessage(@Param("orgKey") orgKey: any, @Param("conversationId") conversationId: string, @Param("id") messageId: string, @Body() userSubmitedParams: any, action: Actions.IAction) {
        const actionContext = new ActionContext();
        actionContext.params = userSubmitedParams;
        actionContext.params.orgKey = orgKey;
        actionContext.params.messageId = messageId;
        actionContext.params.conversationId = conversationId;
        return await action.run(actionContext);
    }

    @Post("/v1/conversations/:conversationId/messages/:id/readers")
    @HttpCode(200)
    @HttpError(403, ExceptionTypes.UserNotAuthorizedException)
    @HttpError(400, ExceptionTypes.ValidationException)
    @UseBefore(OrgAuthMiddleware)
    @UseAction("UserReadMessage")
    public async addReaderToMessage(@Param("orgKey") orgKey: any, @Param("conversationId") conversationId: string, @Param("id") messageId: string, @Body() userSubmitedParams: any, action: Actions.IAction) {
        const actionContext = new ActionContext();
        actionContext.params = userSubmitedParams;
        actionContext.params.orgKey = orgKey;
        actionContext.params.messageId = messageId;
        actionContext.params.conversationId = conversationId;
        return await action.run(actionContext);
    }
}
