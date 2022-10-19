import {WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import { MessageResponseDto } from '../dto';

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
}