import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { CreateFeedInput } from './dtos/create-feed.input';
import { GetFeedsInput } from './dtos/get-feeds.input';
import { Feed } from './feed.entity';

@Injectable()
export class FeedsService {
    constructor(@InjectRepository(Feed) private feedsRepository: Repository<Feed>) { }

    createFeed(user: User, feedInfo: CreateFeedInput) {
        const newFeed = this.feedsRepository.create(feedInfo)
        newFeed.author = user
        return this.feedsRepository.save(newFeed)
    }

    findFeeds(user: User, getFeedsInput: GetFeedsInput) {
        const { skip = 0, take = 10 } = getFeedsInput
        return this.feedsRepository.find({
            relations: {
                author: true
            },
            skip,
            take
        })
    }

    async findOneFeed(id: number) {
        const feed = await this.feedsRepository.findOne({
            where: { id },
            relations: { author: true }
        })
        if (!feed) throw new NotFoundException('feed you are looking for was not found')
        return feed
    }

    async updateFeed(id: number, body: string) {
        const feed = await this.findOneFeed(id)
        return this.feedsRepository.save({ ...feed, body })
    }

    async deleteFeed(id: number){
        const feed = await this.findOneFeed(id)
        this.feedsRepository.remove(feed)
        return 'feed was successfully deleted'
    }
}
