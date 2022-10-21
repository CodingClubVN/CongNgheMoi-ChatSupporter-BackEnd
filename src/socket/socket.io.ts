import {SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import { ConversationResponseDto, MessageResponseDto } from '../dto';

@WebSocketGateway()
export class EventSocketGateway {
	@WebSocketServer()
	server: Server;

	constructor() {

	}
	async handleConnection(client: Socket) {
		const room = client.handshake.query.userId;
		client.join(room);
	}

	public emitMessage(message: MessageResponseDto, listroom: string[]) {
		this.server.in(listroom).emit('new-message', {message});
	}

	@SubscribeMessage('join-room')
	public handleJoinRoom(client: Socket, data: string) {
		client.join(data);
	}

	@SubscribeMessage('leave-room')
	public handleLeaveRoom(client: Socket, data: string) {
		client.leave(data);
	}

	public emitUpdateConversation(conversationResponse: ConversationResponseDto,listRoom: string[]) {
		this.server.in(listRoom).emit('update-conversation', {conversation: conversationResponse});
	}
}