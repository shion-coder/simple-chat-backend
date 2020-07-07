import { createServer } from 'http';
import socketIo from 'socket.io';

import { app } from 'src/app';

import { PORT } from 'src/config';
import { SOCKET_EVENT } from 'src/types';
import { addUser, getUser, getUsersInRoom, removeUser } from 'src/utils';

/* -------------------------------------------------------------------------- */

const server = createServer(app);
const io = socketIo(server);

const { CONNECT, JOIN, MESSAGE, SEND_MESSAGE, ROOM_DATA, DISCONNECT } = SOCKET_EVENT;

io.on(CONNECT, (socket) => {
  socket.on(JOIN, ({ name, room }, callback) => {
    const { user, error } = addUser({ id: socket.id, name, room });

    if (error) {
      return callback(error);
    }

    if (user) {
      socket.join(user.room);

      socket.emit(MESSAGE, { user: 'Admin', text: `Welcome ${user.name}` });
      socket.broadcast.to(user.room).emit(MESSAGE, { user: 'Admin', text: `${user.name} has joined` });

      io.to(user.room).emit(ROOM_DATA, { room: user.room, users: getUsersInRoom(user.room) });

      return callback();
    }
  });

  socket.on(SEND_MESSAGE, (message, callback) => {
    const user = getUser(socket.id);

    if (user) {
      io.to(user.room).emit(MESSAGE, { user: user.name, text: message });

      callback();
    }
  });

  socket.on(DISCONNECT, () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(MESSAGE, { user: 'Admin', text: `${user.name} has left` });

      io.to(user.room).emit(ROOM_DATA, { room: user.room, users: getUsersInRoom(user.room) });
    }
  });
});

server.listen(PORT, () => {
  console.log('\x1b[32m' + `Server listening on port ${PORT}`);
});
