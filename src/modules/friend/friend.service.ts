import { Injectable } from "@nestjs/common";
import { EventSocketGateway } from "../../socket/socket.io";
import { ConversationRepository, FriendRepository, FriendRequestRepository, UserRepository } from "../../repositories";
import { FilterParamDto, MessageCreateDto } from "../../dto";
import { MessageService } from "../message/message.service";

@Injectable({})
export class FriendService {

    constructor(
        private friendRepository: FriendRepository,
        private friendRequestReposiory: FriendRequestRepository,
        private conversationRepository: ConversationRepository,
        private messageService: MessageService,
        private socket: EventSocketGateway,
        private userRepository: UserRepository
    ) {}
    async createFriendRequest(userId: string, friendId: string) {
        const newFriendRequest = await this.friendRequestReposiory.createFriendRequest(userId, friendId);
        const data = await this.friendRequestReposiory.findById(newFriendRequest._id.toString());
        delete data.fromUserId;
        delete data.toUserId;

        this.socket.emitSendRequestFriend(friendId, data);

        return newFriendRequest;
    }

    async approveFriend(fromUserId: string, userId: string) {
        await this.friendRepository.createFriend(userId, fromUserId);
        await this.friendRepository.createFriend(fromUserId, userId);

        const conversation = await this.conversationRepository.createConversation({
            conversationName: 'one-to-one-codingclub',
            arrayUserId: [userId, fromUserId]
        });

        await this.friendRequestReposiory.updateStatus('approve', fromUserId, userId);

        const currentUser = await this.userRepository.findById(userId);
        const fromUser = await this.userRepository.findById(fromUserId);

        const message: MessageCreateDto = {
            conversationId: conversation._id.toString(),
            content: [currentUser.account.username + ' added friend ' + fromUser.account.username],
            type: 'notification',
            fromUserId: userId
        }

        await this.messageService.createMessage(message);

        return true;
    }

    async rejectFriend(fromUserId: string, userId: string) {
        await this.friendRequestReposiory.updateStatus('reject', fromUserId, userId);

        return true;
    }

    async getAllFriendRequest(userId: string, filters: FilterParamDto) {
        const list = await this.friendRequestReposiory.findAll(userId, filters);
        return list;
    }

    async getAllFriend(userId: string, filters: FilterParamDto) {
        const list = await this.friendRepository.findAll(userId, filters);
        return list;
    }

    async removeFriendRequestAfterRequest(fromUserId: string, toUserId: string) {
        await this.friendRequestReposiory.removeFriendRequestAfterRequest(fromUserId, toUserId);
        return true;
    }

}