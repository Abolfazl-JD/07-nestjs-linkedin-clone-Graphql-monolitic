import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from '../users/user.entity';
import { ConnectRequestsService } from './../connect-requests/connect-requests.service';

@Injectable()
export class UpdateRequestGuard implements CanActivate {

    constructor(private connectionReqsService: ConnectRequestsService){}

  async canActivate(
    context: ExecutionContext,
  ) {
        const gqlReq = GqlExecutionContext.create(context)
        const { id: connectionReqId } = gqlReq.getArgs()
        const { user } = gqlReq.getContext().req
        if(user.role === Role.ADMIN) return true
      
        const connectionReq = await this.connectionReqsService.findOneConnectionReqById(connectionReqId)
        return connectionReq.creator.id !== user.id && connectionReq.reciever.id === user.id
  }
}
