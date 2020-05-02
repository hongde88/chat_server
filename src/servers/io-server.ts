import { Server as HTTPServer } from 'http';
import * as socketIO from 'socket.io';
import { EventProcessor } from '../processors/event-processor';

export class IOServer {
  private io: socketIO.Server;
  private eventProcessor: EventProcessor;
  private users: any;
  private rooms: any;

  constructor(httpServer: HTTPServer) {
    this.io = socketIO(httpServer);
    this.eventProcessor = new EventProcessor();
    this.users = {};
    this.rooms = {};
  }

  getUsers() {
    return this.users;
  }

  getRooms() {
    return this.rooms;
  }

  getEventProcessor() {
    return this.eventProcessor;
  }

  handleSocketConnetion(): void {
    this.io.on('connection', (socket) => {
      console.log('\n\nConnection established with a client');
    });
  }
}