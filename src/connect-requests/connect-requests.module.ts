import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionRequest } from './connect-request.entity';
import { ConnectRequestsResolver } from './connect-requests.resolver';
import { ConnectRequestsService } from './connect-requests.service';
import { UsersModule } from './../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConnectionRequest]),
    UsersModule
  ],
  providers: [ConnectRequestsResolver, ConnectRequestsService],
  exports: [ConnectRequestsService]
})
export class ConnectRequestsModule {}
