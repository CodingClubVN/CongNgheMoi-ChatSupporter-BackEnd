import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FilterParamDto, MessageCreateDto } from "../dto";
import { Message } from "../entity";

export class MessageRepository {
    constructor(@InjectModel(Message.name) private readonly messageModel: Model<Message>) {}

    async createMessage(message: MessageCreateDto) {
        message.createdAt = new Date();
        const newMessage = await new this.messageModel(message).save();
        return newMessage;
    }

    async findAllByConversationId(conversationId: string, filters: FilterParamDto) {
        const page = filters.page ? filters.page : 1;
        const perpage = filters.perPage ? filters.perPage : 10;
        const skip = (page - 1)*perpage; 
        const messages = await this.messageModel.find({conversationId: conversationId}, {
            __v: 0
        }).skip(skip).limit(perpage).sort({createdAt: 1});
        return messages;
    }
}