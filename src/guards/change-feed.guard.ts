import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from '../users/user.entity';
import { FeedsService } from './../feeds/feeds.service';

@Injectable()
export class ChangeFeedGuard implements CanActivate {

    constructor(private feedsService: FeedsService){}

  async canActivate(
    context: ExecutionContext,
  ) {
        const gqlReq = GqlExecutionContext.create(context)
        const { id: feedId } = gqlReq.getArgs()
        const { id: userId, role } = gqlReq.getContext().req.user
        if(role === Role.ADMIN) return true
        const feed = await this.feedsService.findOneFeed(feedId)
        return feed.author.id === userId
  }
}
