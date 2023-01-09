import { Module } from '@nestjs/common';
import { MessagesGateway } from './messages.gateway';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Conversation } from './entities/conversation.entity';
import { UsersModule } from './../users/users.module';
import { MessagesResolver } from './messages.resolver';
import { ConnectRequestsModule } from './../connect-requests/connect-requests.module';

@Module({
  imports: [
    UsersModule,
    ConnectRequestsModule,
    TypeOrmModule.forFeature([ Message, Conversation ])
  ],
  providers: [MessagesGateway, MessagesService, MessagesResolver]
})
export class MessagesModule {}
