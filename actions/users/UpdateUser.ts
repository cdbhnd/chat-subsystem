import { Types } from "../../infrastructure/dependency-injection/";
import { OrganizationActionBase } from "../AuthorizationActionBase";
import * as Repositories from "../../repositories";
import * as Entities from "../../entities/";
import { injectable, inject } from "inversify";
import { EntityNotFoundException } from "../../infrastructure/exceptions";
import { ConversationType } from "../../entities/";

@injectable()
export class UpdateUser extends OrganizationActionBase<Entities.IUser> {

  private userRepo: Repositories.IUserRepository;
  private conversationRepo: Repositories.IConversationRepository;
  private messageRepo: Repositories.IMessageRepository;

  constructor(
    @inject(Types.IUserRepository) userRepo: Repositories.IUserRepository,
    @inject(Types.IOrganizationRepository) orgRepo,
    @inject(Types.IConversationRepository) conversationRepo: Repositories.IConversationRepository,
    @inject(Types.IMessageRepository) messageRepo: Repositories.IMessageRepository,
    ) {
    super(orgRepo);
    this.userRepo = userRepo;
    this.conversationRepo = conversationRepo;
    this.messageRepo = messageRepo;
  }

  public async execute(context): Promise<Entities.IUser> {
    const user = await this.userRepo.findOne({ id: context.params.id });
    if (!user) {
      throw new EntityNotFoundException("User", context.params.id);
    }

    const perviousName = `${user.firstName} ${user.lastName}`;
    user.firstName = context.params.firstName ? context.params.firstName : user.firstName;
    user.image = context.params.image ? context.params.image : user.image;
    user.lastName = context.params.lastName ? context.params.lastName : user.lastName;
    user.nickname = context.params.nickname ? context.params.nickname : user.nickname;
    const newName = `${user.firstName} ${user.lastName}`;

    if (newName !== perviousName) {
      // find all direct conversations of this user and update their names with users new name
      const conversations = await this.conversationRepo.find({
        organizationId: context.params.organizationId,
        users: { $elemMatch: { id: context.params.id } },
        type: ConversationType.DIRECT,
      });
      conversations.forEach((conversation) => {
        if (conversation.name.includes(perviousName)) {
          if (conversation.users[0].id === context.params.id) {
            conversation.name = `${newName}, ${conversation.users[1].name}`;
          }
          if (conversation.users[1].id === context.params.id) {
            conversation.name = `${conversation.users[0].name}, ${newName}`;
          }
        }
      });
      await this.conversationRepo.updateMany(conversations);

      // get all messages this user sent and update fromName to users new name
      const messages = await this.messageRepo.find({ fromId: user.id });
      messages.forEach((message) => message.fromName = `${newName}`);
      await this.messageRepo.updateMany(messages);
    }

    // update all conversations where this user is participant with new image and new name
    await this.conversationRepo.updateMultiple(
      {"users.id": user.id},
      {$set: {
        "users.$.name": `${newName}`,
        "users.$.image": user.image,
      }},
    );

    return await this.userRepo.update(user);
  }

  protected getConstraints(): any {
    return {
      id: "string|required",
      firstName: "string",
      image: "string",
      lastName: "string",
      nickname: "string",
    };
  }

  protected getSanitizationPattern(): any {
    return {};
  }
}
