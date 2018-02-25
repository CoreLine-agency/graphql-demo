import { type, query, mutation } from 'decorated-graphql';
import { messages } from '../message/message.graphql';

export const users = [{
  id: '1',
  username: 'toffifee',
  firstName: 'To',
  lastName: 'Fifi'
}, {
  id: '2',
  username: 'jaffa',
  firstName: 'Jaf',
  lastName: 'Fa'
}];

@type`
  id: ID
  username: String
  firstName: String
  lastName: String
  fullName: String
  messages: [Message]`
export class User {
  @query`: [User]`
  users() {
    return users;
  }

  @mutation`(username: String, firstName: String, lastName: String): User`
  createUser(inputArgs) {
    const id = (users.length + 1).toString();
    const newUser = { id, ...inputArgs };
    users.push(newUser);

    return newUser;
  }

  fullName(user) {
    return `${user.firstName} ${user.lastName}`;
  }

  messages(user) {
    return messages.filter(({ senderId, recverId }) => senderId === user.id || recverId === user.id);
  }
}
