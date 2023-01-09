import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from '../users/user.entity';
import { ConnectRequestsService } from './../connect-requests/connect-requests.service';

@Injectable()
export class CreateConversationGuard implements CanActivate {

    constructor(private connectionReqsService: ConnectRequestsService){}

  async canActivate(
    context: ExecutionContext,
  ) {
        const gqlReq = GqlExecutionContext.create(context)
        const { friendId } = gqlReq.getArgs()
        const { user } = gqlReq.getContext().req
        if(user.role === Role.ADMIN) return true
    
        const userFriends = await this.connectionReqsService.getCurrentUserFriends(user.id)
        return userFriends.map(uf => uf.id).includes(friendId)
  }
}
