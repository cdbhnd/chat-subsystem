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
        @inject(Types.IChatMessagesService) private messageService: Entities.IChatMessagesService,
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

        return await this.messageService.getMessagesFeed(conversation.id, context.params.cursor, context.params.limit);
    }

    protected getConstraints(): any {
        return {
            conversationId: "string|required",
            limit: "integer",
            cursor: "string",
        };
    }

    protected getSanitizationPattern() {
        return {};
    }
}
