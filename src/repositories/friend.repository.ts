import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Friend } from "src/entity";

export class ConversationRepository {
    constructor(
        // @InjectModel(Conversation.name) private readonly conversationModel: Model<Conversation>,
        // @InjectModel(User.name) private readonly userModel: Model<User>
        @InjectModel(Friend.name) private readonly friendModel: Model<Friend>,
    ){}
}