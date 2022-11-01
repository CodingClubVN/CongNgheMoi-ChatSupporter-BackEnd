import { Injectable } from "@nestjs/common";
import { EventSocketGateway } from "../../socket/socket.io";
import { ConversationRepository, FriendRepository, FriendRequestRepository } from "../../repositories";
import { FilterParamDto } from "../../dto";

@Injectable({})
export class FriendService {

    constructor(
        private friendRepository: FriendRepository,
        private friendRequestReposiory: FriendRequestRepository,
        private conversationRepository: ConversationRepository,
        private socket: EventSocketGateway
    ) {}
    
    async createFriendRequest(userId: string, friendId: string) {
        const newFriendRequest = await this.friendRequestReposiory.createFriendRequest(userId, friendId);

        return newFriendRequest;
    }

    async approveFriend(friendRequestId: string) {
        const friendRequest = await this.friendRequestReposiory.findById(friendRequestId);
        await this.friendRepository.createFriend(friendRequest.fromUserId, friendRequest.toUserId);
        await this.friendRepository.createFriend(friendRequest.toUserId, friendRequest.fromUserId);

        await this.conversationRepository.createConversation({
            conversationName: 'one-to-one-codingclub',
            arrayUserId: [friendRequest.fromUserId, friendRequest.toUserId]
        });

        await this.friendRequestReposiory.updateStatus('approve', friendRequestId);

        return true;
    }

    async rejectFriend(friendRequestId: string) {
        await this.friendRequestReposiory.updateStatus('reject', friendRequestId);

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
}