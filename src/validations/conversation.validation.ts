import { Injectable } from "@nestjs/common";
import { ConversationCreateDto } from "../dto";
import { ConversationRepository } from "../repositories";

@Injectable({})
export class ConversationValidation {
    constructor(private conversationRepository: ConversationRepository){}

    async checkCreateConversation(conversation: ConversationCreateDto) {
        const conversationCheck = await this.conversationRepository.getConversationByName(conversation.conversationName);
        if (conversationCheck) {
            return 'conversation name exists!'
        }
        return '';
    }
}