import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { ConnectionRequest, StatusEnum } from './connect-request.entity';
import { UsersService } from './../users/users.service';

@Injectable()
export class ConnectRequestsService {
    
    constructor(
        @InjectRepository(ConnectionRequest) private connectReqsRepository: Repository<ConnectionRequest>,
        private usersService: UsersService
    ) { }

    async createConnectReq(creatorId: number, recieverId: number) {
        const connectionRequestAlreadyExists = await this.getUserConnectStatus(creatorId, recieverId)
        if (connectionRequestAlreadyExists !== 'not-sent-any-connection-requests')
            throw new BadRequestException('this request has already exists')

        const { creator, reciever } = await this.findCreatorAndReciever(creatorId, recieverId)
        const newConnectRequest = this.connectReqsRepository.create()
        newConnectRequest.creator = creator
        newConnectRequest.reciever = reciever
        return this.connectReqsRepository.save(newConnectRequest)
    }

    async getUserConnectStatus(currentUserId: number, recieverId:number) {
        const { creator, reciever } = await this.findCreatorAndReciever(currentUserId, recieverId)

        const connectionRequest = await this.connectReqsRepository.findOne({
            relations: { creator: true, reciever: true },
            where: [
                { creator, reciever },
                { creator: reciever, reciever: creator }
            ]
        })

        
        if(!connectionRequest) return 'not-sent-any-connection-requests'
        const { status } = connectionRequest
        if (connectionRequest?.reciever.id === currentUserId && status === 'pending') return 'waiting-for-current-user-to-answer'
        return status
    }

    findRecievedConnectReqs(creator: User) {
        return this.connectReqsRepository.find({
            relations: { reciever: true, creator: true },
            where: {
                reciever: {
                    id: creator.id
                }
            }
        })
    }

    async updateConnectStatus(id: number, status: StatusEnum) {
        const connectionRequest = await this.findOneConnectionReqById(id)
        return this.connectReqsRepository.save({ ...connectionRequest, status })
    }

    async findOneConnectionReqById(id: number) {
        const connectionRequest = await this.connectReqsRepository.findOne({
            relations: { creator: true, reciever: true },
            where: { id }
        })
        if (!connectionRequest) throw new NotFoundException('the connection request was not found')
        return connectionRequest
    }

    async findCreatorAndReciever(creatorId: number, recieverId: number) {
        const reciever = await this.usersService.getSingleUserById(recieverId)
        const creator = await this.usersService.getSingleUserById(creatorId)
        return { reciever, creator }
    }

    async getCurrentUserFriends(userId: number) {
        const acceptedConnectionReqs = await this.getUserAcceptedReqs(userId)
        const friends: User[] = []

        for (const connectionReq of acceptedConnectionReqs) {
            let user: User
            if (connectionReq.creator.id === userId) 
                user = await this.usersService.getSingleUserById(connectionReq.reciever.id)
            else user = await this.usersService.getSingleUserById(connectionReq.creator.id)
            friends.push(user)
        }

        return friends
    }

    async getUserAcceptedReqs(userId: number) {
        const acceptedConnectionReqs = await this.connectReqsRepository.find({
            relations: { creator: true, reciever: true },
            where: [
                { creator: { id: userId }, status: StatusEnum.ACCEPTED },
                { reciever: { id: userId }, status: StatusEnum.ACCEPTED }
            ]
        })

        return acceptedConnectionReqs
    }
}
