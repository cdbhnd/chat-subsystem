import { IUser, IMessage, IConversation } from "../entities/";
import { Types, kernel } from "../infrastructure/dependency-injection/";
import { injectable, inject } from "inversify";
import { IEventMediator } from "../infrastructure/eventEngine/IEventMediator";
import { EventAggregator } from "../infrastructure/eventEngine/EventAggregator";
import { IConversationRepository } from "../repositories/index";
import { OperationNotPermited, EntityNotFoundException } from "../infrastructure/exceptions/index";

export interface IMessageService {
    subscribeUserToConversation(userId: string, conversationId: string, callback: (event: any, data: IMessage) => void): Promise<void>;
}

@injectable()
export class MessageService implements IMessageService {

    private eventMediator: IEventMediator;
    private conversationRepository: IConversationRepository;
    private userConversationSubscriptions: any;
    private userNotified: any;

    constructor(
        @inject(Types.EventMediator) eventMediator: IEventMediator,
        @inject(Types.IConversationRepository) conversationRepository: IConversationRepository) {
        this.eventMediator = eventMediator;
        this.conversationRepository = conversationRepository;
        this.userConversationSubscriptions = {};
        this.userNotified = {};
    }

    public async subscribeUserToConversation(userId: string, conversationId: string, callback: (ecent: string, data: any) => void): Promise<void> {
        const conversation: IConversation = await this.conversationRepository.findOne({ id: conversationId });
        if (!this.userConversationSubscriptions[userId]) {
            this.userConversationSubscriptions[userId] = [];
        }
        if (this.userConversationSubscriptions[userId].indexOf(conversationId) !== -1) {
            return;
        }
        if (!conversation) {
            throw new EntityNotFoundException("conversation", conversationId);
        }

        const conversationUser = conversation.users.find((x) => x.id === userId);
        if (!conversationUser) {
            throw new OperationNotPermited("Conversation Subscription");
        }

        this.eventMediator.subscribe(EventAggregator.NEW_MESSAGE, async (event: any, data: IMessage) => {
            if (!this.userNotified[userId]) {
                this.userNotified[userId] = [];
            }
            if (this.userNotified[userId].indexOf({ message: data.id, event }) !== -1) {
                return;
            }
            const conversationFresh: IConversation = await this.conversationRepository.findOne({ id: data.conversationId });
            const cu = conversationFresh.users.find((x) => x.id === userId);
            if (conversationFresh && !!cu) {
                this.userNotified[userId].push({ message: data.id, event });
                callback(event, { userId: userId, message: data });
            }
        });

        this.eventMediator.subscribe(EventAggregator.MESSAGE_LIKED, async (event: any, data: IMessage) => {
            if (!this.userNotified[userId]) {
                this.userNotified[userId] = [];
            }
            const conversationFresh: IConversation = await this.conversationRepository.findOne({ id: data.conversationId });
            const cu = conversationFresh.users.find((x) => x.id === userId);
            if (conversationFresh && !!cu) {
                this.userNotified[userId].push({ message: data.id, event });
                callback(event, { userId: userId, message: data });
            }
        });
        this.userConversationSubscriptions[userId].push(conversationId);
    }
}
