import { Injectable } from "@nestjs/common";
import { ConversationCreateDto, ConversationUpdateDto, FilterParamDto } from "../../dto";
import { ConversationRepository } from '../../repositories';


@Injectable({})
export class ConversationService {

    constructor(private conversationRepository: ConversationRepository) { }

    async createConversation(conversation: ConversationCreateDto) {
        const newConversation = await this.conversationRepository.createConversation(conversation);
        return { conversationId: newConversation._id };
    }

    async addUserToConversation(arrayUserId: string[], conversationId: string) {
        return await this.conversationRepository.addUsersToGroup(arrayUserId, conversationId);
    }

    async getConversationId(conversationId: string) {
        return await this.conversationRepository.getConversationById(conversationId);
    }

    async findAllByUser(filters: FilterParamDto, userId: string) {
        return await this.conversationRepository.getAll(filters, userId);
    }

    async updateConversation(conversationId: string, conversation: ConversationUpdateDto) {
        return await this.conversationRepository.updateConversation(conversationId, conversation);
    }

}