import * as express from 'express';
import * as socketIO from 'socket.io';
import * as http from 'http';
import * as path from 'path';

export class Server {
  private httpServer: http.Server;
  private app: express.Application;
  private io: socketIO.Server;

  private readonly DEFAULT_PORT = 3000;

  private users: any = {};
  private rooms: any = {};

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    this.app = express();
    this.httpServer = http.createServer(this.app);
    this.io = socketIO(this.httpServer);

    this.configureApp();
    this.configureRoutes();
    this.handleSocketConnection();
  }

  private configureApp(): void {
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, '../../public')));
  }

  private configureRoutes(): void {
    this.app.get('/', (req, res) => {
      res.sendFile('index.html');
    });

    this.app.use('/user', require('../routes/user-route'));
  }

  private handleSocketConnection(): void {
    this.io.on('connection', (socket) => {
      console.log('\n\nConnection established with a client');

      socket.on('validate', (inData, inCallback) => {
        console.log('\n\nMSG: validate');
        console.log(`inData = ${JSON.stringify(inData)}`);
        // if (!inCallback) inCallback = () => {};

        const user = this.users[inData.userName];
        console.log(`user = ${JSON.stringify(user)}`);

        if (user) {
          if (user.password === inData.password) {
            console.log('User logged in');
            inCallback({ status: 'ok' });
          } else {
            console.log('Incorrect password');
            inCallback({ status: 'fail' });
          }
        } else {
          console.log('User created');
          this.users[inData.userName] = inData;
          socket.broadcast.emit('newUser', this.users);
          inCallback({ status: 'created' });
        }
      });

      socket.on('create', (inData, inCallback) => {
        // if (!inCallback) inCallback = () => {};
        console.log(`\n\nMSG: create ${inData}`);

        if (this.rooms[inData.roomName]) {
          console.log('Room already exists');
          inCallback({ status: 'exists' });
        } else {
          console.log('Creating a room');
          inData.users = {};
          this.rooms[inData.roomName] = inData;
          console.log(`rooms = ${JSON.stringify(this.rooms)}`);
          socket.broadcast.emit('created', this.rooms);
          inCallback({ status: 'created', rooms: this.rooms });
        }
      });

      socket.on('listRooms', (inData, inCallback) => {
        // if (!inCallback) inCallback = () => {};
        console.log(`\n\nMSG: listRooms ${this.rooms}`);
        console.log(`Returning: ${JSON.stringify(this.rooms)}`);
        inCallback(this.rooms);
      });

      socket.on('listUsers', (inData, inCallback) => {
        // if (!inCallback) inCallback = () => {};
        console.log(`\n\nMSG: listUsers ${JSON.stringify(this.users)}`);
        console.log(`Returning: ${JSON.stringify(this.users)}`);
        inCallback(this.users);
      });

      socket.on('join', (inData, inCallback) => {
        // if (!inCallback) inCallback = () => {};
        console.log(`\n\nMSG: join ${inData}`);

        const room = this.rooms[inData.roomName];

        if (Object.keys(room.users).length >= this.rooms.maxPeople) {
          console.log('Room is full');
          inCallback({ status: 'full' });
        } else {
          console.log(`Add user ${inData.userName} - user info: ${this.users[inData.userName]}`);
          room.users[inData.userName] = this.users[inData.userName];
          socket.broadcast.emit('joined', room);
          inCallback({ status: 'joined', room });
        }
      });

      socket.on('post', (inData, inCallback) => {
        console.log(`\n\nMSG: post message - data: ${JSON.stringify(inData)}`);
        socket.broadcast.emit('posted', inData);
        inCallback({ status: 'ok' });
      });

      socket.on('invite', (inData, inCallback) => {
        console.log(`\n\nMSG: invite`);
        socket.broadcast.emit('invited', inData);
        inCallback({ status: 'ok' });
      });

      socket.on('leave', (inData, inCallback) => {
        console.log('\n\nMSG: leave');
        const room = this.rooms[inData.roomName];
        delete room.users[inData.userName];
        socket.broadcast.emit('left', room);
        inCallback({ status: 'ok' });
      });

      socket.on('close', (inData, inCallback) => {
        console.log(`\n\nMSG: close - roomName: ${inData.roomName}`);

        delete this.rooms[inData.roomName];
        socket.broadcast.emit('closed', { roomName: inData.roomName, rooms: this.rooms });
        inCallback(this.rooms);
      });

      socket.on('kick', (inData, inCallback) => {
        console.log(`\n\nMSG: kick - data: ${inData}`);
        const room = this.rooms[inData.roomName];
        const users = room.users;
        delete users[inData.userName];
        socket.broadcast.emit('kicked', room);
        inCallback({ status: 'ok' });
      });
    });
  }

  public listen(callback: (port: number) => void): void {
    this.httpServer.listen(this.DEFAULT_PORT, () => {
      callback(this.DEFAULT_PORT);
    });
  }
}
