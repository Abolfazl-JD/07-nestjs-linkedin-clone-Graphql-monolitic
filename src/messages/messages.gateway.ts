import { UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, ConnectedSocket, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { CreateMessageDto } from './dtos/create-message.dto';
import { MessagesService } from './messages.service';

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class MessagesGateway {

  constructor(private messagesService: MessagesService){}

  @WebSocketServer()
  server: Server;

  @UseInterceptors(ClassSerializerInterceptor)
  @SubscribeMessage('join')
  async join(@MessageBody('email') email: string, @ConnectedSocket() client: Socket) {
    const user = await this.messagesService.addClientIdToUser(email, client.id)
    client.data.user = user
    return user
  }

  @SubscribeMessage('sendMessage')
  async sendNewMessage(@MessageBody() messageInfo: CreateMessageDto, @ConnectedSocket() client: Socket) {
    // check if the user is a member of conversation with id of messageInfo.conversation_id
    const userIsMemberOfConversation = await this.messagesService.checkUserConversation(messageInfo.conversation_id, client.data.user)
    if (!userIsMemberOfConversation) throw new WsException('user is not a member of this conversation')
    
    const newMessage = await this.messagesService.createNewMessage(messageInfo, client.data.user.id)
    this.server.emit('newMessageComing', newMessage)
    return 'message created successfully'
  }

  @SubscribeMessage('getConversationMessages')
  async getAllConversationMessages(
    @MessageBody('conversation_id') conversation_id: number,
    @ConnectedSocket() client: Socket
  ) {
    // check if the user is a member of conversation with id of conversation_id
    const userIsMemberOfConversation = await this.messagesService.checkUserConversation(conversation_id, client.data.user)
    console.log('userIsMemberOfConversation',userIsMemberOfConversation)
    if (!userIsMemberOfConversation) throw new WsException('user is not a member of this conversation')
    console.log(' user is member of conversation')
    const messages = await this.messagesService.findConversationMessages(conversation_id)
    console.log(messages)
    return messages
  }
}
