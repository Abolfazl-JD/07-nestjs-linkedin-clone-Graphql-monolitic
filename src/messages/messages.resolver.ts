import { ClassSerializerInterceptor, UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Context, Int, Mutation, Resolver, Query } from '@nestjs/graphql';
import { Message } from './entities/message.entity';
import { MessagesService } from './messages.service';
import { AuthorizationGuard } from './../guards/authorization.guard';
import { Conversation } from './entities/conversation.entity';
import { CreateConversationGuard } from '../guards/create-conversation.guard';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthorizationGuard)
@Resolver(() => Message)
export class MessagesResolver {

    constructor(private messagesService: MessagesService) { }
  
    @Mutation(() => Conversation)
    @UseGuards(CreateConversationGuard)
    async createNewConversation(
        @Args({ name: "friendId", type: () => Int }) friendId: number,
        @Context() { req }: any
    ) {
        return this.messagesService.createNewConversation(req.user.id, friendId)
    }
  
    @Query(() => Conversation, { name : "conversation", nullable: true })
    async getSingleConversation(
        @Args({ name: "friendId", type: () => Int }) friendId: number,
        @Context() { req }: any
    ) {
        return this.messagesService.getConversationByUserIds(req.user.id, friendId) || null
    }
    

    @Query(() => [Conversation], { name : "allUserConversations" })
    async getAllConversations(@Context() { req }: any) {
        return this.messagesService.findUserConversationsWithRelations(req.user.id)
    }
}
