import { Injectable } from "@nestjs/common";
import { ConversationCreateDto } from "../../dto";
import { ConversationRepository } from '../../repositories';


@Injectable({})
export class ConversationService {

    constructor(private conversationRepository: ConversationRepository){}

    async createConversation(conversation: ConversationCreateDto) {
        const newConversation = await this.conversationRepository.createConversation(conversation);
        return {conversationId: newConversation._id};
    }
    
}