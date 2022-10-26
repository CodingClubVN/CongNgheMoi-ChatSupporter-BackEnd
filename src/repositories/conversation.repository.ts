import { InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ConversationCreateDto, FilterParamDto, ListConversationResponseDto,ConversationUpdateDto, MessageResponseDto } from "../dto";
import { MessageModel } from "src/entity/models/message.model";
import { User, Conversation } from "../entity";
const mongoose = require('mongoose');


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
                    userId: user._id
                });
            }
            const newConversation = await new this.conversationModel(
                {
                    conversationName: conversation.conversationName,
                    users: users,
                    createdAt: new Date().getTime(),
                    updatedAt:  new Date().getTime()
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
                    userId: user._id
                });
            }
            await this.conversationModel.updateOne(
                {_id: conversationId},
                {
                    $set: ({users: users, updatedAt: new Date().getTime()})
                }
            );
        }catch(error) {
            throw new InternalServerErrorException(error);
        }
    }

    async getConversationById(conversationId: string) {
        try {
            const id = mongoose.Types.ObjectId(conversationId);
            const conversations = await this.conversationModel.aggregate([
                {
                    $match: {_id: id}
                },
                {
                    $sort: {updatedAt: -1}
                },
                { $unwind: "$users" },
                {
                    $lookup: {
                        from: "users",
                        localField: "users.userId",
                        foreignField: "_id",
                        as: "user"
                    }
                }, 
                { $unwind: "$user" },
                { $group: {
                    _id: "$_id",
                    conversationName: { $last: "$conversationName" },
                    lastMessage: { $last: "$lastMessage" },
                    readStatus: { $last: "$readStatus" },
                    createdAt: { $last: "$createdAt" },
                    updatedAt: { $last: "$updatedAt" },
                    users: { "$push": "$user" },
                }},
                {
                    $project: {
                        __v: 0,
                        "users.email": 0,
                        "users.fullname": 0,
                        "users.account.password": 0,
                        "users.phone": 0,
                        "users.createdAt": 0,
                        "users.updatedAt": 0,
                        "users.__v": 0
                    }
                }
            ]);
            return conversations[0];
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
            const id = mongoose.Types.ObjectId(userId);
            const options = filters.search ? {
                conversationName: {$regex: filters.search },
                "users.userId": id
            } : {"users.userId": id};
            const conversations = await this.conversationModel.aggregate([
                {
                    $match: options
                },
                {
                    $sort: {updatedAt: -1}
                },
                { $unwind: "$users" },
                {
                    $lookup: {
                        from: "users",
                        localField: "users.userId",
                        foreignField: "_id",
                        as: "user"
                    }
                }, 
                { $unwind: "$user" },
                { $group: {
                    _id: "$_id",
                    conversationName: { $last: "$conversationName" },
                    lastMessage: { $last: "$lastMessage" },
                    readStatus: { $last: "$readStatus" },
                    createdAt: { $last: "$createdAt" },
                    updatedAt: { $last: "$updatedAt" },
                    users: { "$push": "$user" },
                }},
                {
                    $project: {
                        __v: 0,
                        "users.email": 0,
                        "users.fullname": 0,
                        "users.account.password": 0,
                        "users.phone": 0,
                        "users.createdAt": 0,
                        "users.updatedAt": 0,
                        "users.__v": 0
                    }
                },
                {
                    $skip: skip
                }, {
                    $limit: Number(perpage)
                }
            ]);
            const total = await this.conversationModel.count({"users.userId": id});
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
                $set: ({lastMessage: lastMessage, readStatus: [], updatedAt: new Date().getTime()})
            }
        );
    }

    async updateConversation(conversationId: string, conversation: ConversationUpdateDto) {
        try {
            const conversationUpdate = await this.conversationModel.findById(conversationId);
            conversationUpdate.conversationName = conversation.conversationName;
            conversationUpdate.updatedAt=new Date().getTime();
            await this.conversationModel.updateOne({_id: conversationId}, conversationUpdate);
            return conversationUpdate;
        }catch(error){
            throw new InternalServerErrorException(error);
        }
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

    async checkUserFromConversationByUserId(conversationId,userId: string) {
        const conversation = await this.conversationModel.find(
            {
                _id: mongoose.Types.ObjectId(conversationId), 
                "users.userId": mongoose.Types.ObjectId(userId)
            });
        
        if (conversation.length) {
            return true;
        }
        return false;
    }
}