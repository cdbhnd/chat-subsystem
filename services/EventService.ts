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

    constructor(@inject(Types.EventMediator) eventMediator: IEventMediator,
                @inject(Types.IConversationRepository) conversationRepository: IConversationRepository) {
        this.eventMediator = eventMediator;
        this.conversationRepository = conversationRepository;
    }

    public async subscribeUserToConversation(userId: string, conversationId: string, callback: (ecent: string, data: IMessage) => void): Promise<void> {
        const conversation: IConversation = await this.conversationRepository.findOne({ id: conversationId });

        if (!conversation) {
            throw new EntityNotFoundException("conversation", conversationId);
        }

        if (conversation.userIds.indexOf(userId) === -1) {
            throw new OperationNotPermited("Conversation Subscription");
        }

        this.eventMediator.subscribe(EventAggregator.NEW_MESSAGE, async (event: any, data: IMessage) => {
            const conversationFresh: IConversation = await this.conversationRepository.findOne({ id: conversationId });
            if (conversationFresh && conversationFresh.userIds.indexOf(userId) !== -1) {
                callback(event, data);
            }
        });
    }
}
