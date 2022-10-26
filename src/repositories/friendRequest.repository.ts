import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FriendRequest } from "src/entity";

export class ConversationRepository {
    constructor(
        // @InjectModel(Conversation.name) private readonly conversationModel: Model<Conversation>,
        // @InjectModel(User.name) private readonly userModel: Model<User>
        @InjectModel(FriendRequest.name) private readonly friendModel: Model<FriendRequest>,
    ){}

    async createFriendRequest(fromUserId: string, toUserId: string) {
        
    }
}