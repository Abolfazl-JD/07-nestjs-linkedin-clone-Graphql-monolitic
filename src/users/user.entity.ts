import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql"
import { Exclude } from "class-transformer";
import { ConnectionRequest } from "../connect-requests/connect-request.entity";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany } from "typeorm"
import { Feed } from './../feeds/feed.entity';
import { Message } from './../messages/entities/message.entity';
import { Conversation } from './../messages/entities/conversation.entity';

export enum Role {
    USER = 'user',
    PREMIUM = 'premium',
    ADMIN = 'admin'
}


registerEnumType(Role, {
  name: "Role", // this one is mandatory
  description: "The basic directions", // this one is optional
})

@ObjectType()
@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number
    
    @Column({ nullable: true })
    @Field({ nullable: true })
    firstName: string

    @Column()
    @Field()
    lastName: string

    @Column({ unique: true })
    @Field()
    email: string

    @Exclude()
    @Column()
    @Field({ defaultValue: "Not allowed" })
    password: string

    @Column({ type: 'enum', enum: Role, default: Role.USER })
    @Field(() => Role)
    role: Role

    @Column({ nullable: true })
    @Field({ nullable: true })
    imagePath: string

    @Field({ nullable: true })
    @Column({ nullable: true })
    client_id: string
    
    @OneToMany(() => Feed, feed => feed.author)
    feeds: Feed[]

    @Field()
    jwtToken: string

    @Field(() => [ConnectionRequest], { nullable: true })
    @OneToMany(() => ConnectionRequest, connectionRequest => connectionRequest.creator)
    sentConnectRequests: ConnectionRequest[]
  
    @Field(() => [ConnectionRequest], { nullable: true })
    @OneToMany(() => ConnectionRequest, connectionRequest => connectionRequest.reciever)
    recievedConnectRequests: ConnectionRequest[]

    @Field(() => [Message], { nullable: true })
    @OneToMany(() => Message, message => message.user)
    messages: Message[]
  
    @Field(() => [Conversation], { nullable: true })
    @ManyToMany(() => Conversation, conversation => conversation.users)
    conversations: Conversation[]
}
