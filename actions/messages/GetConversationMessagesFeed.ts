import { inject, injectable } from "inversify";
import { ActionContext } from "..";
import { Types } from "../../infrastructure/dependency-injection";
import * as Entities from "../../entities";
import * as Services from "../../services";
import * as Repositories from "../../repositories";
import * as Exceptions from "../../infrastructure/exceptions/";
import { OrganizationActionBase } from "../AuthorizationActionBase";

@injectable()
export class GetConversationMessagesFeed extends OrganizationActionBase<Entities.IMessage[]> {
    public static alias = "GetConversationMessagesFeed";

    constructor(
        @inject(Types.IConversationRepository) private conversationRepo: Repositories.IConversationRepository,
        @inject(Types.IChatMessagesService) private messageService: Services.IChatMessagesService,
        @inject(Types.IOrganizationRepository) orgRepo: Repositories.IOrganizationRepository,
    ) {
        super(orgRepo);
    }

    public async execute(context: ActionContext): Promise<Entities.IMessage[]> {
        const conversation: Entities.IConversation = await this.conversationRepo.findOne({
            id: context.params.conversationId,
            organizationId: context.params.organizationId,
        });

        if (!conversation) {
            throw new Exceptions.EntityNotFoundException("conversation", {
                id: context.params.conversationId,
                organizationId: context.params.organizationId,
            });
        }

        let messages: Entities.IMessage[] = [];
        if (!context.params.messageId) {
            messages = await this.messageService.getMessagesFeed(
                conversation.id,
                context.params.cursor,
                context.params.limit,
            );
        } else {
            messages = await this.messageService.getMessagesFromMessageId(conversation.id, context.params.messageId);
        }

        console.log("messages being sent");
        console.log(messages);

        return messages;
    }

    protected getConstraints(): any {
        return {
            conversationId: "string|required",
            limit: "integer",
            cursor: "string",
            messageId: "string",
        };
    }

    protected getSanitizationPattern() {
        return {};
    }
}
