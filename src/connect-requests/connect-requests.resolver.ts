import { ClassSerializerInterceptor, UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Resolver, Int, Context, Query } from '@nestjs/graphql';
import { ConnectionRequest, StatusEnum } from './connect-request.entity';
import { ConnectRequestsService } from './connect-requests.service';
import { AuthorizationGuard } from './../guards/authorization.guard';
import { GetStatusGuard } from './../guards/get-status.guard';
import { UpdateRequestGuard } from './../guards/update-request.guard';
import { User } from '../users/user.entity';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthorizationGuard)
@Resolver(() => ConnectionRequest)
export class ConnectRequestsResolver {

    constructor(private connectReqsService: ConnectRequestsService){}

    @Mutation(() => ConnectionRequest)
    sendConnectRequest(
        @Args({ name: 'recieverId', type: () => Int }) recieverId: number,
        @Context() { req }: any
    ) {
        return this.connectReqsService.createConnectReq(req.user.id, recieverId)
    }

    @UseGuards(GetStatusGuard)
    @Query(() => String, { nullable: true, name: 'connectionRequest' })
    getUserConnectStatus(
        @Args({ name: 'recieverId', type: () => Int }) recieverId: number,
        @Context() { req }: any
    ) {
        return this.connectReqsService.getUserConnectStatus(req.user.id, recieverId)
    }

    @Query(() => [ConnectionRequest], { name: 'connectionRequests' })
    findRecievedConnectReqs(@Context() { req }: any) {
        return this.connectReqsService.findRecievedConnectReqs(req.user)
    }

    @UseGuards(UpdateRequestGuard)
    @Mutation(() => ConnectionRequest)
    updateConnectStatus(
        @Args({ name: 'id', type: () => Int }) id: number,
        @Args({name: 'status', type: () => String}) status: StatusEnum
    ) {
        return this.connectReqsService.updateConnectStatus(id, status)
    }

    @Query(() => [User], { name: 'friends' })
    getUserFriends(@Context() { req }: any) {
        return this.connectReqsService.getCurrentUserFriends(req.user.id)
    }
}
