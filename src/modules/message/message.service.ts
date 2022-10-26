import { Injectable } from "@nestjs/common";
import { EventSocketGateway } from "../../socket/socket.io";
import { FilterParamDto, MessageCreateDto, MessageResponseDto } from "../../dto";
import { ConversationRepository, MessageRepository } from "../../repositories";

@Injectable({})
export class MessageService {

    constructor(private messageRepository: MessageRepository, private socket: EventSocketGateway,private conversationRepository: ConversationRepository){}

    async createMessage(message: MessageCreateDto) {
        const newMessage = await this.messageRepository.createMessage(message);
        const data: MessageResponseDto = await this.messageRepository.findById(newMessage._id.toString());
        let listRoom = [];
        listRoom.push(newMessage.conversationId.toString());
        this.socket.emitMessage(data, listRoom);
        delete data._id;
        delete data.description;
        delete data.user;
        await this.conversationRepository.updateLastMessageAndClearReadStatusConversation(data, message.conversationId);
        await this.emitUpdateConversation(message.conversationId.toString());
        return newMessage;
    }

    async getAllByConversationId (conversationId: string, filters: FilterParamDto){
        return await this.messageRepository.findAllByConversationId(conversationId, filters);
    }

    async emitUpdateConversation(conversationId: string) {
        let listRoom= [];
        const conversation = await this.conversationRepository.getConversationById(conversationId);
        for (let user of conversation.users) {
            listRoom.push(user._id.toString());
        }
        this.socket.emitUpdateConversation(conversation, listRoom);
    }
    
}