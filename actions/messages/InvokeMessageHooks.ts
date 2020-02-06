import { Types } from "../../infrastructure/dependency-injection/";
import { ActionContext, ActionBase } from "../ActionBase";
import * as Repositories from "../../repositories";
import * as Entities from "../../entities/";
import { injectable, inject } from "inversify";
import { IWebHookProvider } from "../../providers/IWebHookProvider";
import { IMessage } from "../../entities/";
import { EntityNotFoundException } from "../../infrastructure/exceptions";

@injectable()
export class InvokeMessageHooks extends ActionBase<Entities.IOrganization[]> {

  constructor(
    @inject(Types.IWebHookProvider) private webhookProvider: IWebHookProvider,
    @inject(Types.IOrganizationRepository) private orgRepo: Repositories.IOrganizationRepository,
    @inject(Types.IConversationRepository) private conversationRepo: Repositories.IConversationRepository) {
    super();
  }

  public async execute(context: ActionContext): Promise<Entities.IOrganization[]> {
    const organizations = await this.orgRepo.find({ hooks: { $elemMatch: { event: "NEW_MESSAGE" } } });
    const message: IMessage = { ...context.params };

    const conversation = await this.conversationRepo.findOne({ id: message.conversationId });
    if (!conversation) {
      throw new EntityNotFoundException("conversation", message.conversationId);
    }

    for (let i = 0; i < organizations.length; i++) {
      try {
        const hook = organizations[i].hooks.find((x) => x.event === "NEW_MESSAGE");
        if (hook && hook.url) {
          const data: any = {...message};
          data.recipients = conversation.users.filter((x) => x.id !== message.fromId);
          data.sender = conversation.users.find((x) => x.id === message.fromId);
          await this.webhookProvider.invoke(hook.url, data);
        }
      } catch (err) {
        console.log(err);
      }
    }

    return organizations;
  }

  protected getConstraints(): any {
    return {};
  }

  protected getSanitizationPattern(): any {
    return {};
  }
}
