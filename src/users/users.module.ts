import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([ User ])],
  providers: [UsersResolver, UsersService, AuthService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
