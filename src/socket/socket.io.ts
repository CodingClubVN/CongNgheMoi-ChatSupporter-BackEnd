import {WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {Server} from 'socket.io';

@WebSocketGateway()
export class EventSocketGateway {
	@WebSocketServer()
	server: Server;

	public testEmit(test) {
		this.server.emit('onAdd', {test});
	}
}