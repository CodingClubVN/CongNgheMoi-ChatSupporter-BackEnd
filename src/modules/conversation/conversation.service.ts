import { Injectable } from "@nestjs/common";
import { ConversationCreateDto, ConversationUpdateDto, FilterParamDto, MessageCreateDto } from "../../dto";
import { ConversationRepository, MessageRepository, UserRepository } from '../../repositories';
import { MessageService } from "../message/message.service";


@Injectable({})
export class ConversationService {

    constructor(private conversationRepository: ConversationRepository, private userRepository: UserRepository, private messageService: MessageService){}

    async createConversation(userId: string,conversation: ConversationCreateDto) {
        const newConversation = await this.conversationRepository.createConversation(userId,conversation);
        return {conversationId: newConversation._id};
    }

    async addUserToConversation(arrayUserId: string[], conversationId: string, userId: string) {
        const currentUser = await this.userRepository.findById(userId);
        let arrayUserName = [];
        for(let id of arrayUserId) {
            const user = await this.userRepository.findById(id);
            arrayUserName.push(user.account.username);
        }
        const content = currentUser.account.username + ' added '+ arrayUserName.toString()+' to the group';

        const message: MessageCreateDto = {
            conversationId: conversationId,
            content: [content],
            type: 'notification',
            fromUserId: userId
        }

        await this.messageService.createMessage(message);
        return await this.conversationRepository.addUsersToGroup(arrayUserId, conversationId);
    }
    
    async getConversationId(conversationId: string) {
        return await this.conversationRepository.getConversationById(conversationId);
    }

    async findAllByUser(filters: FilterParamDto, userId: string) {
        return await this.conversationRepository.getAll(filters, userId);
    }

    async updateConversation(conversationId: string, conversation: ConversationUpdateDto, userId: string) {
        const currentUser = await this.userRepository.findById(userId);
        const content = currentUser.account.username + " changed the group's name to " + conversation.conversationName;

        const message: MessageCreateDto = {
            conversationId: conversationId,
            content: [content],
            type: 'notification',
            fromUserId: userId
        }

        await this.messageService.createMessage(message);
        return await this.conversationRepository.updateConversation(conversationId, conversation);
    }

    async updateReadStatus(userId: string, conversationId: string) {
        await this.conversationRepository.updateReadStatus(userId, conversationId);
    }

    async removeUserFromConversation(userId: string, conversationId: string, currentUserId: string) {
        const currentUser = await this.userRepository.findById(currentUserId);
        const userRemove = await this.userRepository.findById(userId);
        const content = currentUser.account.username + ' removed '+ userRemove.account.username+' from the group';

        const message: MessageCreateDto = {
            conversationId: conversationId,
            content: [content],
            type: 'notification',
            fromUserId: currentUserId
        }

        await this.messageService.createMessage(message);
        await this.conversationRepository.removeUserFromConversation(conversationId , userId);
    }

    async changeRoleUser(conversationId: string, userId: string, role: string) {
        await this.conversationRepository.changeRoleForUser(conversationId, userId, role);
    }

    async findRoleConversationByUserId(conversationId: string, userId: string) {
        return await this.conversationRepository.findRoleConversationByUserId(conversationId, userId);
    }
}