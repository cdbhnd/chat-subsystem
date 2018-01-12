import * as Actions from "../../actions";
import { ExceptionTypes } from "../../infrastructure/exceptions/";
import { JsonController, Param, Body, Get, Post, Put, Delete, Req, Res, HttpCode, UseBefore } from "routing-controllers";
import { ActionContext } from "../../actions";
import { AuthMiddleware, QueryParserMiddleware, AdminMiddleware } from "../middleware/";
import * as jwt from "jwt-simple";
import * as config from "config";
import { HttpError, UseAction } from "../decorators/";
import { TransformResponse } from "../decorators/transform";
import { IUser } from "../../entities/";

@JsonController()
export class TherpaistController {

    @Post("/v1/token")
    @HttpCode(200)
    @HttpError(403, ExceptionTypes.UserNotAuthorizedException)
    @HttpError(400, ExceptionTypes.ValidationException)
    @UseAction("AuthenticateOrganization")
    @TransformResponse("IOrganization", "OrganizationModel")
    public async authenticateOrganization(@Body() userSubmitedParams: any, action: Actions.IAction) {
        const actionContext = new ActionContext();
        actionContext.params = userSubmitedParams;
        const organization = await action.run(actionContext);
        const secret: string = String(config.get("secret"));
        return {
            id: organization.id,
            name: organization.name,
            token: jwt.encode({ authUserId: organization.id }, secret),
        };
    }

    @Get("/v1/organizations")
    @HttpCode(200)
    @HttpError(403, ExceptionTypes.UserNotAuthorizedException)
    @HttpError(400, ExceptionTypes.ValidationException)
    @UseAction("GetOrganizations")
    @UseBefore(AdminMiddleware)
    @UseBefore(QueryParserMiddleware)
    @TransformResponse("IOrganization", "OrganizationModel")
    public async getOrganizations(@Param("userId") userId: any, @Param("query") query: any, action: Actions.IAction) {
        const actionContext = new ActionContext();
        actionContext.params = {
            userId: userId,
        };
        actionContext.query = query;
        return await action.run(actionContext);
    }

    @Post("/v1/organizations")
    @HttpCode(200)
    @HttpError(403, ExceptionTypes.UserNotAuthorizedException)
    @HttpError(400, ExceptionTypes.ValidationException)
    @UseAction("CreateOrganization")
    @UseBefore(AdminMiddleware)
    @TransformResponse("IOrganization", "OrganizationModel")
    public async createOrganization(@Param("userId") userId: any, @Body() userSubmitedParams: any, action: Actions.IAction) {
        const actionContext = new ActionContext();
        actionContext.params = userSubmitedParams;
        actionContext.params.userId = userId;
        return await action.run(actionContext);
    }

    @Get("/v1/organizations/:id")
    @HttpCode(200)
    @HttpError(403, ExceptionTypes.UserNotAuthorizedException)
    @HttpError(400, ExceptionTypes.ValidationException)
    @HttpError(404, ExceptionTypes.EntityNotFoundException)
    @UseBefore(AuthMiddleware)
    @UseAction("GetOrganizationById")
    @TransformResponse("IOrganization", "OrganizationModel")
    public async getOrganization(@Param("userId") userId: any, @Param("id") organizationId: string, action: Actions.IAction) {
        const actionContext = new ActionContext();
        actionContext.params = {
            userId: userId,
            organizationId: organizationId,
        };
        return await action.run(actionContext);
    }

    @Put("/v1/organizations/:id")
    @HttpCode(200)
    @HttpError(403, ExceptionTypes.UserNotAuthorizedException)
    @HttpError(400, ExceptionTypes.ValidationException)
    @HttpError(404, ExceptionTypes.EntityNotFoundException)
    @UseBefore(AuthMiddleware)
    @UseAction("UpdateOrganization")
    @TransformResponse("IOrganization", "OrganizationModel")
    public async updateOrganization(@Body() userSubmitedParams: any, @Param("userId") userId: any, @Param("id") organizationId: string, action: Actions.IAction) {
        const actionContext = new ActionContext();
        actionContext.params = userSubmitedParams;
        actionContext.params.userId = userId;
        actionContext.params.organizationId = organizationId;
        return await action.run(actionContext);
    }

    @Delete("/v1/organizations/:id")
    @HttpCode(204)
    @HttpError(403, ExceptionTypes.UserNotAuthorizedException)
    @HttpError(400, ExceptionTypes.ValidationException)
    @HttpError(404, ExceptionTypes.EntityNotFoundException)
    @UseBefore(AdminMiddleware)
    @UseAction("DeleteOrganization")
    @TransformResponse("IOrganization", "OrganizationModel")
    public async deleteOrganization(@Param("userId") userId: any, @Param("id") organizationId: string, action: Actions.IAction) {
        const actionContext = new ActionContext();
        actionContext.params = {
            userId: userId,
            organizationId: organizationId,
        };
        return await action.run(actionContext);
    }
}
