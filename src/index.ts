require('dotenv').config();

import { Server } from "./servers/server";

const server = new Server();

require('./config/db')();

server.listen((port) => {
  console.log(`Server is listening on http://localhost:${port}`);
});
