import { Resolver, Args, Mutation, Query, Int, Context } from '@nestjs/graphql';
import { Feed } from './feed.entity';
import { FeedsService } from './feeds.service';
import { CreateFeedInput } from './dtos/create-feed.input';
import { GetFeedsInput } from './dtos/get-feeds.input';
import { UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from './../guards/authorization.guard';
import { ChangeFeedGuard } from './../guards/change-feed.guard';

@UseGuards(AuthorizationGuard)
@Resolver(() => Feed)
export class FeedsResolver {

    constructor(private feedsService: FeedsService){}

    @Mutation(() => Feed)
    createFeed(@Args('createFeedInput') feedInfo: CreateFeedInput, @Context() ctx: any) {
        return this.feedsService.createFeed(ctx.req.user, feedInfo)
    }

    @Query(() => [Feed], { name: 'feeds' })
    findFeeds(@Args('getFeedsInput') getFeedsInput: GetFeedsInput, @Context() ctx: any) {
        return this.feedsService.findFeeds(ctx.req.user, getFeedsInput)
    }

    @UseGuards(ChangeFeedGuard)
    @Mutation(() => Feed)
    updateFeed(
        @Args({ name: 'id', type: () => Int }) id: number,
        @Args('body') body: string
    ) {
        return this.feedsService.updateFeed(id, body)
    }

    @UseGuards(ChangeFeedGuard)
    @Mutation(() => String)
    deleteFeed(@Args({ name: 'id', type: () => Int }) id: number) {
        return this.feedsService.deleteFeed(id)
    }
}
