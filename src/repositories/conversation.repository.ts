import { InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ConversationCreateDto } from "../dto";
import { User, Conversation } from "../entity";



export class ConversationRepository {
    constructor(
        @InjectModel(Conversation.name) private readonly conversationModel: Model<Conversation>,
        @InjectModel(User.name) private readonly userModel: Model<User>
    ){

    }

    async createConversation(conversation: ConversationCreateDto) {
        try {
            let users = [];
            for (let userId of conversation.arrayUserId){
                const user =await this.userModel.findById(userId);
                users.push({
                    userId: user._id,
                    username: user.account.username,
                    avatarUrl: user.avatarUrl
                });
            }
            const newConversation = await new this.conversationModel(
                {
                    conversationName: conversation.conversationName,
                    users: users
                }
            ).save();
            return newConversation;
        }catch(error) {
            throw new InternalServerErrorException(error);
        }
    }

    // async addUsersToGroup(litsUserId: string[]) {
    //     try {
    //         let users = [];
    //         for (let userId of litsUserId){
    //             const user =await this.userModel.findById(userId);
    //             users.push({
    //                 userId: user._id,
    //                 username: user.account.username,
    //                 avatarUrl: user.avatarUrl
    //             });
    //         }
    //     }catch(error) {
    //         throw new InternalServerErrorException(error);
    //     }
    // }

    async getConversationById(conversationId: string) {
        try {
            const conversation = await this.conversationModel.findById(conversationId);
            return conversation;
        } catch(error) {
            throw new InternalServerErrorException(error);
        }
    }

    async getConversationByName(conversationName: string) {
        try {
            const conversation = await this.conversationModel.findOne({conversationName: conversationName});
            return conversation;
        } catch(error) {
            throw new InternalServerErrorException(error);
        }
    }
}