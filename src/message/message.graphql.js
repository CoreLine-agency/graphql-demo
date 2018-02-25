import { mutation, query, type, subscription, publish } from 'decorated-graphql';

export const messages = [{
  id: '1',
  senderId: '1',
  recverId: '2',
  content: 'Stæ?',
}, {
  id: '2',
  senderId: '2',
  recverId: '1',
  content: 'A e...',
}];

import { users } from '../user/user.graphql';

@type`
  id: ID
  senderId: ID
  recverId: ID
  content: String
  sender: User
  recver: User`
export class Message {
  @mutation`(senderId: ID!, recverId: ID!, content: String!): Message`
  send(msg) {
    const id = (messages.length + 1).toString();
    const newMessage = { id, ...msg };
    messages.push(newMessage);

    publish('onMessageCreate', newMessage);

    return newMessage;
  }

  @subscription`(recverId: ID): Message`
  onMessageCreate(newMessage, input) {
    return newMessage.recverId === input.recverId;
  }

  sender(message) {
    return users.filter(user => message.senderId === user.id)[0];
  }

  recver(message) {
    return users.filter(user => message.recverId === user.id)[0];
  }
}

