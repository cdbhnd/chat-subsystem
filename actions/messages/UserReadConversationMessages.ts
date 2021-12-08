import { Types, kernel } from "../../infrastructure/dependency-injection/";
import { OrganizationActionBase } from "../AuthorizationActionBase";
import * as Exceptions from "../../infrastructure/exceptions/";
import * as Repositories from "../../repositories";
import * as Entities from "../../entities/";
import { injectable, inject } from "inversify";
import { IEventMediator } from "../../infrastructure/eventEngine/IEventMediator";
import { EventAggregator } from "../../infrastructure/eventEngine/EventAggregator";

@injectable()
export class UserReadConversationMessages extends OrganizationActionBase<Entities.IMessage[]> {

    private messageRepo: Repositories.IMessageRepository;
    private userRepo: Repositories.IUserRepository;
    private eventMediator: IEventMediator;

    constructor(
        @inject(Types.IMessageRepository) messagerepo: Repositories.IMessageRepository,
        @inject(Types.IOrganizationRepository) orgRepo,
        @inject(Types.IUserRepository) userRepo: Repositories.IUserRepository,
        @inject(Types.EventMediator) eventMediator: IEventMediator) {
        super(orgRepo);
        this.messageRepo = messagerepo;
        this.userRepo = userRepo;
        this.eventMediator = eventMediator;
    }

    public async execute(context): Promise<Entities.IMessage[]> {
        const user: Entities.IUser = await this.userRepo.findOne({ id: context.params.userId, organizationId: context.params.organizationId });

        if (!user) {
            throw new Exceptions.EntityNotFoundException("user", context.params.userId);
        }

        let messages: Entities.IMessage[] = await this.messageRepo.find({ conversationId: context.params.conversationId, seenBy: { $exists: true, $ne: user.id }, fromId: { $ne: user.id } });

        if (!messages.length) {
            return messages;
        }

        messages.forEach((message) => {
            if (message.seenBy.indexOf(user.id) === -1 && message.fromId !== user.id) {
                message.seenBy.push(user.id);
            }
        });

        messages = await this.messageRepo.updateMany(messages);

        // currently not in use; broadcasting only last message seen for now
        /* this.eventMediator.boradcastEvent(EventAggregator.READ_CONVERSATION_MESSAGES, messages); */

        this.eventMediator.boradcastEvent(EventAggregator.READ_MESSAGE, messages[messages.length - 1]);

        return messages;
    }

    protected getConstraints(): any {
        return {
            conversationId: "string|required",
            userId: "string|required",
        };
    }

    protected getSanitizationPattern(): any {
        return {};
    }
}
