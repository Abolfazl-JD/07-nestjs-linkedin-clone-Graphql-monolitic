import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GetStatusGuard implements CanActivate {

  async canActivate(
    context: ExecutionContext,
  ) {
        const gqlReq = GqlExecutionContext.create(context)
        const { recieverId } = gqlReq.getArgs()
        const { id: userId } = gqlReq.getContext().req.user
      
        return userId !== recieverId
  }
}
