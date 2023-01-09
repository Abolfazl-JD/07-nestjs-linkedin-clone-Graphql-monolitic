import { DataSource } from "typeorm"
import { User } from "./src/users/user.entity"
import { config } from 'dotenv';
import { ConfigService } from "@nestjs/config";
import { Message } from "./src/messages/entities/message.entity";
import { Conversation } from "./src/messages/entities/conversation.entity";
import { Feed } from "./src/feeds/feed.entity";
import { ConnectionRequest } from "./src/connect-requests/connect-request.entity";
import { CreateTables1669555659089 } from './migrations/1669555659089-CreateTables';

config();

const configService = new ConfigService();


export default new DataSource({
    type: 'postgres',
    host: configService.get('POSTGRES_HOST'),
    port: configService.get('POSTGRES_PORT'),
    username: configService.get('POSTGRES_USERNAME'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DATABASE'),
    synchronize: false,
    entities: [User, Message, Conversation, Feed, ConnectionRequest],
    migrations : [CreateTables1669555659089]
})