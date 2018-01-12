import { Container } from "inversify";
import Types from "./Types";
import * as Repositories from "../../repositories/";
import * as Services from "../../services/";
import * as Providers from "../../providers/";
import * as Entities from "../../entities/";
import * as DB from "../../database/index";
import * as actions from "../../actions";
import {Logger} from "../logger/Logger";
import * as Tasks from "../cron/tasks";
import {ILogger} from "../logger/ILogger";
import {IEventMediator} from "../eventEngine/IEventMediator";
import {EventMediator} from "../eventEngine/EventMediator";
import { AuthenticateOrganization } from "../../actions/organizations/AuthenticateOrganization";
import { CreateOrganization } from "../../actions/organizations/CreateOrganization";
import { GetOrganizations } from "../../actions/organizations/GetOrganizations";
import { AuthenticateUser } from "../../actions/users/AuthenticateUser";
import { UpdateOrganization } from "../../actions/organizations/UpdateOrganization";
import { GetOrganizationById } from "../../actions/organizations/GetOrganizationById";
import { DeleteOrganization } from "../../actions/organizations/DeleteOrganization";
import { CreateConversation } from "../../actions/conversations/CreateConversation";
import { GetConversations } from "../../actions/conversations/GetConversations";
import { UpdateConversation } from "../../actions/conversations/UpdateConversation";
import { GetConversationById } from "../../actions/conversations/GetConversationById";
import { DeleteConversation } from "../../actions/conversations/DeleteConversation";

const container = new Container();

container.bind<Repositories.IOrganizationRepository>(Types.IOrganizationRepository).to(DB.Organization);
container.bind<string>("entityName").toConstantValue("organizations").whenInjectedInto(DB.Organization);

container.bind<Repositories.IConversationRepository>(Types.IConversationRepository).to(DB.Conversation);
container.bind<string>("entityName").toConstantValue("conversations").whenInjectedInto(DB.Conversation);

container.bind<Repositories.IUserRepository>(Types.IUserRepository).to(DB.User);
container.bind<string>("entityName").toConstantValue("user").whenInjectedInto(DB.User);

container.bind<Repositories.IScheduledTaskRepository>(Types.IScheduledTaskRepository).to(DB.ScheduledTask);
container.bind<string>("entityName").toConstantValue("scheduledTasks").whenInjectedInto(DB.ScheduledTask);

container.bind<actions.IAction>(Types.IAction).to(CreateConversation).whenTargetNamed("CreateConversation");
container.bind<actions.IAction>(Types.IAction).to(GetConversations).whenTargetNamed("GetConversations");
container.bind<actions.IAction>(Types.IAction).to(UpdateConversation).whenTargetNamed("UpdateConversation");
container.bind<actions.IAction>(Types.IAction).to(GetConversationById).whenTargetNamed("GetConversationById");
container.bind<actions.IAction>(Types.IAction).to(DeleteConversation).whenTargetNamed("DeleteConversation");
container.bind<actions.IAction>(Types.IAction).to(AuthenticateUser).whenTargetNamed("AuthenticateUser");
container.bind<actions.IAction>(Types.IAction).to(CreateOrganization).whenTargetNamed("CreateOrganization");
container.bind<actions.IAction>(Types.IAction).to(GetOrganizations).whenTargetNamed("GetOrganizations");
container.bind<actions.IAction>(Types.IAction).to(UpdateOrganization).whenTargetNamed("UpdateOrganization");
container.bind<actions.IAction>(Types.IAction).to(GetOrganizationById).whenTargetNamed("GetOrganizationById");
container.bind<actions.IAction>(Types.IAction).to(DeleteOrganization).whenTargetNamed("DeleteOrganization");
container.bind<actions.IAction>(Types.IAction).to(AuthenticateOrganization).whenTargetNamed("AuthenticateOrganization");

////////////////////

container.bind<ILogger>(Types.Logger).to(Logger).inSingletonScope();
container.bind<IEventMediator>(Types.EventMediator).to(EventMediator);

export default container;
