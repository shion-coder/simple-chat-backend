import { User } from 'src/types';

/* -------------------------------------------------------------------------- */

const users: User[] = [];

export const addUser = ({ id, name, room }: User) => {
  name = name.trim();
  room = room.trim();

  const existingUser = users.find((user) => user.name === name && user.room === room);

  if (existingUser) {
    return { error: 'Username is taken' };
  }

  const user = { id, name, room };

  users.push(user);

  return { user };
};

export const removeUser = (id: string) => {
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) {
    return;
  }

  return users.splice(index, 1)[0];
};

export const getUser = (id: string) => users.find((user) => user.id === id);

export const getUsersInRoom = (room: string) => users.filter((user) => user.room === room);
