import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FilterParamDto, MessageCreateDto } from "../dto";
import { Message } from "../entity";
const mongoose = require('mongoose');

export class MessageRepository {
    constructor(@InjectModel(Message.name) private readonly messageModel: Model<Message>) {}

    async createMessage(message: MessageCreateDto) {
        message.createdAt = new Date().getTime();
        const newMessage = await new this.messageModel(message).save();
        return newMessage;
    }

    async findAllByConversationId(conversationId: string, filters: FilterParamDto) {
        const page = filters.page ? filters.page : 1;
        const perpage = filters.perPage ? filters.perPage : 30;
        const skip = (page - 1)*perpage;
        const id = mongoose.Types.ObjectId(conversationId);

        const messages = await this.messageModel.aggregate([
            {
                $match: {conversationId: id}
            },
            {
                $lookup: {
                    from: 'users',
                    localField: "fromUserId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {$unwind: '$user'},
            {
                $project: {
                    "__v": 0,
                    "user.account.password": 0,
                    "user.__v": 0,
                    "user.fullname": 0,
                    "user.email": 0,
                    "user.phone": 0,
                    "user.createdAt": 0,
                    "user.updatedAt": 0,
                }
            },
            {
                $skip: skip
            }, {
                $limit: perpage
            }, {
                $sort: {createdAt: -1}
            }
        ])
        return messages;
    }
}