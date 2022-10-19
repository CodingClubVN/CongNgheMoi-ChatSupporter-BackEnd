import { Injectable } from "@nestjs/common";
import { EventSocketGateway } from "../../socket/socket.io";
import { FilterParamDto, MessageCreateDto, MessageResponseDto } from "../../dto";
import { ConversationRepository, MessageRepository } from "../../repositories";

@Injectable({})
export class MessageService {

    constructor(private messageRepository: MessageRepository, private socket: EventSocketGateway,private conversationRepository: ConversationRepository){}

    async createMessage(message: MessageCreateDto) {
        const newMessage = await this.messageRepository.createMessage(message);
        const data: MessageResponseDto = {
            _id: newMessage._id,
            content: newMessage.content,
            conversationId: newMessage.conversationId,
            createdAt: newMessage.createdAt,
            description: newMessage.description,
            fromUserId: newMessage.fromUserId,
            type: newMessage.type
        }
        const conversation = await this.conversationRepository.getConversationById(message.conversationId);
        let listRoom = [];
        for (let user of conversation.users) {
            listRoom.push(user.userId);
        }
        this.socket.emitMessage(data, listRoom);
        delete data._id;
        delete data.description;
        this.conversationRepository.updateLastMessageAndClearReadStatusConversation(data, message.conversationId);
        return newMessage;
    }

    async getAllByConversationId (conversationId: string, filters: FilterParamDto){
        return await this.messageRepository.findAllByConversationId(conversationId, filters);
    }
    
}