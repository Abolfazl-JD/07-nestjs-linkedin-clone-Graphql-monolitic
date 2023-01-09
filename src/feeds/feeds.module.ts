import { Module } from '@nestjs/common';
import { FeedsResolver } from './feeds.resolver';
import { FeedsService } from './feeds.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feed } from './feed.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Feed ])
  ],
  providers: [FeedsResolver, FeedsService]
})
export class FeedsModule {}
