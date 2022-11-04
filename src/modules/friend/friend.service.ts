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
        private userRepository: UserRepository,
        private messageService: MessageService,
        private socket: EventSocketGateway
    ) {}
    
    async createFriendRequest(userId: string, friendId: string) {
        const newFriendRequest = await this.friendRequestReposiory.createFriendRequest(userId, friendId);
        const data = await this.friendRequestReposiory.findById(newFriendRequest._id.toString());
        delete data.fromUserId;
        delete data.toUserId;
        
        this.socket.emitSendRequestFriend(friendId, data);

        return newFriendRequest;
    }

    async approveFriend(friendRequestId: string) {
        const friendRequest = await this.friendRequestReposiory.findById(friendRequestId);
        await this.friendRepository.createFriend(friendRequest.fromUserId, friendRequest.toUserId);
        await this.friendRepository.createFriend(friendRequest.toUserId, friendRequest.fromUserId);

        const conversation = await this.conversationRepository.createConversation({
            conversationName: 'one-to-one-codingclub',
            arrayUserId: [friendRequest.fromUserId, friendRequest.toUserId]
        });

        await this.friendRequestReposiory.updateStatus('approve', friendRequestId);

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

    async createNotificationMessage(conversationId: string, fromUserId: string, toUserId: string) {
        const user = await 

        const message: MessageCreateDto = {
            conversationId: conversation._id.toString(),
            content: ['added friend to you'],
            type: 'notification',
            fromUserId: friendRequest.toUserId
        }

        await this.messageService.createMessage(message);

        return true;
    }
}