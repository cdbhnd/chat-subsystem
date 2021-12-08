import { Types, kernel } from "../../infrastructure/dependency-injection/";
import { ActionContext, ActionBase } from "../ActionBase";
import { OrganizationActionBase } from "../AuthorizationActionBase";
import * as Exceptions from "../../infrastructure/exceptions/";
import * as Services from "../../services/";
import * as Repositories from "../../repositories";
import * as Entities from "../../entities/";
import { injectable, inject } from "inversify";
import { IEventMediator } from "../../infrastructure/eventEngine/IEventMediator";
import { EventMediator } from "../../infrastructure/eventEngine/EventMediator";
import { EventAggregator } from "../../infrastructure/eventEngine/EventAggregator";
import { EntityNotFoundException } from "../../infrastructure/exceptions/";

@injectable()
export class UserReadMessage extends OrganizationActionBase<Entities.IMessage> {

  private messageRepo: Repositories.IMessageRepository;
  private userRepo: Repositories.IUserRepository;
  private eventMediator: IEventMediator;

  constructor(
    @inject(Types.IMessageRepository) messageRepo: Repositories.IMessageRepository,
    @inject(Types.IOrganizationRepository) orgRepo,
    @inject(Types.IUserRepository) userRepo: Repositories.IUserRepository,
    @inject(Types.EventMediator) eventMediator: IEventMediator,
    ) {
    super(orgRepo);
    this.messageRepo = messageRepo;
    this.userRepo = userRepo;
    this.eventMediator = eventMediator;
  }

  public async execute(context: ActionContext): Promise<Entities.IMessage> {

    const user: Entities.IUser = await this.userRepo.findOne({ id: context.params.userId, organizationId: context.params.organizationId });

    if (!user) {
        throw new Exceptions.EntityNotFoundException("user", context.params.userId);
    }

    let message: Entities.IMessage = await this.messageRepo.findOne({ id: context.params.messageId });

    if (!message) {
        throw new Exceptions.EntityNotFoundException("message", context.params.messageId);
    }

    if (message.readers.indexOf(user.id) !== -1) {
        return message;
    }

    message.readers.push(user.id);

    if (!message.seenBy) {
      message.seenBy = [];
    }
    message.seenBy.push(user.id);

    message = await this.messageRepo.update(message);

    this.eventMediator.boradcastEvent(EventAggregator.READ_MESSAGE, message);

    return message;
  }

  protected getConstraints(): any {
    return {
      messageId: "string|required",
      userId: "string|required",
    };
  }

  protected getSanitizationPattern(): any {
    return {};
  }
}
