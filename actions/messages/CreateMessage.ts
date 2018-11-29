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

@injectable()
export class CreateMessage extends OrganizationActionBase<Entities.IMessage> {

  private messageRepo: Repositories.IMessageRepository;
  private userRepo: Repositories.IUserRepository;
  private eventMediator: IEventMediator;

  constructor(@inject(Types.IMessageRepository) messagerepo: Repositories.IMessageRepository,
              @inject(Types.IOrganizationRepository) orgRepo,
              @inject(Types.IUserRepository) userRepo: Repositories.IUserRepository,
              @inject(Types.EventMediator) eventMediator: IEventMediator) {
    super(orgRepo);
    this.messageRepo = messagerepo;
    this.userRepo = userRepo;
    this.eventMediator = eventMediator;
  }

  public async execute(context): Promise<Entities.IMessage> {
    const user: Entities.IUser = await this.userRepo.findOne({ id: context.params.fromId, organizationId: context.params.organizationId });

    if (!user) {
        throw new Exceptions.EntityNotFoundException("user", context.params.fromId);
    }

    let message: Entities.IMessage = {
      id: null,
      readers: [ context.params.fromId ],
      content: context.params.content,
      fromId: context.params.fromId,
      conversationId: context.params.conversationId,
      timestamp: new Date().toISOString(),
      fromName: user.nickname,
    };
    message = await this.messageRepo.create(message);

    this.eventMediator.boradcastEvent(EventAggregator.NEW_MESSAGE, message);

    return message;
  }

  protected getConstraints(): any {
    return {
      content: "string|required",
      fromId: "string|required",
      conversationId: "string|required",
    };
  }

  protected getSanitizationPattern(): any {
    return {};
  }
}