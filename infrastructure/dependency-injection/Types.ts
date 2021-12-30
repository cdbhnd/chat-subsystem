const Types = {
    // types definitions [console_app_comment]
    IAction: Symbol("IAction"),
    IUserRepository: Symbol("IUserRepository"),
    IOrganizationRepository: Symbol("IOrganizationRepository"),
    ICronTask: Symbol("ICronTask"),
    EventMediator: Symbol("EventMediator"),
    Logger: Symbol("Logger"),
    IScheduledTaskRepository: Symbol("IScheduledTaskRepository"),
    IConversationRepository: Symbol("IConversationRepository"),
    IMessageRepository: Symbol("IMessageRepository"),
    IMessageService: Symbol("IMessageService"),
    IWebHookProvider: Symbol("IWebHookProvider"),
    IChatMessagesService: Symbol("IChatMessagesService"),
};

export default Types;
