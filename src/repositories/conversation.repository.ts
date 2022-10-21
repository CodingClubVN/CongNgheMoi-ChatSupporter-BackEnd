import { InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MessageModel } from "src/entity/models/message.model";
import { ConversationCreateDto, FilterParamDto, ListConversationResponseDto, MessageResponseDto } from "../dto";
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
                    userId: user._id.toString(),
                    username: user.account.username,
                    avatarUrl: user.avatarUrl
                });
            }
            const newConversation = await new this.conversationModel(
                {
                    conversationName: conversation.conversationName,
                    users: users,
                    createdAt: new Date()
                }
            ).save();
            return newConversation;
        }catch(error) {
            throw new InternalServerErrorException(error);
        }
    }

    async addUsersToGroup(litsUserId: string[], conversationId: string) {
        try {
            const conversation = await this.conversationModel.findById(conversationId);
            
            let users = conversation.users;
            for (let userId of litsUserId){
                const user =await this.userModel.findById(userId);
                users.push({
                    userId: user._id.toString(),
                    username: user.account.username,
                    avatarUrl: user.avatarUrl,
                });
            }
            await this.conversationModel.updateOne(
                {_id: conversationId},
                {
                    $set: ({users: users, updatedAt: new Date()})
                }
            );
        }catch(error) {
            throw new InternalServerErrorException(error);
        }
    }

    async getConversationById(conversationId: string) {
        try {
            const conversation = await this.conversationModel.findById(conversationId, {
                __v: 0
            });
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

    async getAll(filters: FilterParamDto, userId: string) {
        try {
            const page = filters.page ? filters.page : 1;
            const perpage = filters.perPage ? filters.perPage : 10;
            const skip = (page - 1)*perpage; 
            const options = filters.search ? {
                conversationName: {$regex: filters.search },
                "users.userId": userId
            } : {"users.userId": userId};
            const conversations = await this.conversationModel.find(options, {__v: 0}).skip(skip).limit(perpage).sort({updatedAt: -1});
            const total = await this.conversationModel.count({"users.userId": userId});
            const data = new ListConversationResponseDto({total, data: conversations});
            return data;
        }catch(error) {
            throw new InternalServerErrorException(error);
        }
    }

    async updateLastMessageAndClearReadStatusConversation(message: MessageResponseDto, conversationId: string) {
        const lastMessage = message as MessageModel;
        await this.conversationModel.updateOne(
            {_id: conversationId},
            {
                $set: ({lastMessage: lastMessage, readStatus: [], updatedAt: new Date()})
            }
        );
    }

    async updateReadStatus(userId: string, conversationId: string) {
        const conversation = await this.getConversationById(conversationId);
        let readStatus = conversation.readStatus;

        if(!readStatus.includes(userId)){
            readStatus.push(userId);
        }

        await this.conversationModel.updateOne(
            {_id: conversationId},
            {
                $set: ({readStatus: readStatus})
            }
        );
    }
}