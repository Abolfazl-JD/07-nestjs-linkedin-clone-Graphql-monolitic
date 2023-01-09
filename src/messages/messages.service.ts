import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "./../users/users.service";
import { Message } from "./entities/message.entity";
import { Conversation } from "./entities/conversation.entity";
import { CreateMessageDto } from './dtos/create-message.dto';
import { Role, User } from "../users/user.entity";

@Injectable()
export class MessagesService {
    constructor(
        private usersService: UsersService,
        @InjectRepository(Message) private messagesRepository: Repository<Message>,
        @InjectRepository(Conversation) private conversationsRepository: Repository<Conversation>
    ) { }
    
    async addClientIdToUser(email: string, client_id: string) {
        const user = await this.usersService.findUserByEmail(email)
        return this.usersService.saveUser({ ...user, client_id })
    }

    async createNewConversation(userId: number, friendId: number) {
        const { currentUser, friend } = await this.findUserAndfriendId(userId, friendId)
        const conversationAlreadyExists = await this.getConversationByUserIds(userId, friendId) || null
        if (conversationAlreadyExists) throw new BadRequestException("this request has already exists")
        const newConversation = this.conversationsRepository.create()
        newConversation.users = [currentUser, friend]
        return this.conversationsRepository.save(newConversation)
    }

    async getConversationByUserIds(currentUserId: number, friendId: number) {
        return this.conversationsRepository
        .createQueryBuilder("conversation")
        .leftJoin("conversation.users", "user")
        .where("user.id = :currentUserId", { currentUserId })
        .orWhere("user.id = :friendId", { friendId })
        .groupBy("conversation.id")
        .having("COUNT(*) > 1")
        .getOne()
    }

    async findUserConversationsWithRelations(userId: number) {
        // get conversations that one user blongs to them
        const conversationsWithOneUser = await this.getOneUserConversations(userId)
        
        // find conversations with the information of two users in it
        const detailedUserConversations: Conversation[] = []
        for (const conversation of conversationsWithOneUser) {
            const detailedConversation = await this.getConversationById(conversation.id)
            detailedUserConversations.push(detailedConversation)
        }
        return detailedUserConversations
    }

    getOneUserConversations(userId: number) {
        return this.conversationsRepository
        .createQueryBuilder("conversation")
        .innerJoin("conversation.users", "user")
        .where("user.id = :userId", { userId })
        .orderBy("conversation.lastUpdate", "DESC")
        .getMany()
    }

    getConversationById(id: number) {
        return this.conversationsRepository.findOne({
            where: { id },
            relations: {
                messages: true,
                users: true
            }
        })
    }

    async findUserAndfriendId(userId: number, friendId: number) {
        const currentUser = await this.usersService.getSingleUserById(userId)
        const friend = await this.usersService.getSingleUserById(friendId)
        if(!friend || !currentUser) throw new NotFoundException('user not found')
        return { currentUser, friend }
    }

    async createNewMessage(messageInfo: CreateMessageDto, id: number) {
        const { conversation_id, text } = messageInfo
        const conversation = await this.getConversationById(conversation_id)
        const user = await this.usersService.getSingleUserById(id)
        return this.messagesRepository.save({ text, conversation, user })
    }

    findConversationMessages(conversationId: number) {
        return this.messagesRepository.find({
            relations: { conversation: true, user: true },
            where: {
                conversation: {
                    id: conversationId
                }
            },
            order: {
                createdAt: "ASC",
                id: "ASC"
            }
        })
    }

    async checkUserConversation(conversationId: number, user: User) {
        if(user.role === Role.ADMIN) return true
        const conversation = await this.getConversationById(conversationId)
        return conversation.users.map(cu => cu.id).includes(user.id)
    }

}
