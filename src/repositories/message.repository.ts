import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FilterParamDto, MessageCreateDto } from "../dto";
import { Message } from "../entity";

export class MessageRepository {
    constructor(@InjectModel(Message.name) private readonly messageModel: Model<Message>) {}

    async createMessage(message: MessageCreateDto) {
        const date = new Date()
        message.createdAt = date.toISOString();
        try {
            const newMessage = await new this.messageModel(message).save();

            console.log(newMessage);
            
            return newMessage;
        }catch(error) {
            console.log(error);
            
        }
    }

    async findAllByConversationId(conversationId: string, filters: FilterParamDto) {
        const page = filters.page ? filters.page : 1;
        const perpage = filters.perPage ? filters.perPage : 10;
        const skip = (page - 1)*perpage; 
        const messages = await this.messageModel.find({conversationId: conversationId}, {
            __v: 0
        }).skip(skip).limit(perpage).sort({createdAt: 1});
        // const messages = await this.messageModel.aggregate([
        //     {
        //         $match: {conversationId: "634fd205b94a35c96f5a3e44"}
        //     },
        //     // {
        //     //     $lookup: {
        //     //         from: "users",
        //     //         localField: "fromUserId",
        //     //         foreignField: "_id",
        //     //         as: "user"
        //     //     }
        //     // }
        // ])
        return messages;
    }
}