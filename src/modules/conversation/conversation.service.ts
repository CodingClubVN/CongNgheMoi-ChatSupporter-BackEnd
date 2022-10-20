import { Injectable } from "@nestjs/common";
import { ConversationCreateDto, ConversationUpdateDto, FilterParamDto } from "../../dto";
import { ConversationRepository } from '../../repositories';


@Injectable({})
export class ConversationService {

    constructor(private conversationRepository: ConversationRepository) { }https://github.com/CodingClubVN/CongNgheMoi-ChatSupporter-BackEnd/pull/8/conflict?name=src%252Frepositories%252Fconversation.repository.ts&ancestor_oid=56c44e88cde29a0ca08a0e8236fe60c36498efd7&base_oid=93ded8043596d6b5737e61d118b21ed5c45112e1&head_oid=0c33f594a6904f4ecf360e00ba598201a481564d

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

    async updateReadStatus(userId: string, conversationId: string) {
        await this.conversationRepository.updateReadStatus(userId, conversationId);
    }
}