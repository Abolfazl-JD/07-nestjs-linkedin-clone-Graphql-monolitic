import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from '../../users/user.entity';
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Conversation } from './conversation.entity';

@ObjectType()
@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number

    @Field()
    @Column()
    text: string

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date

    @Field(() => User)
    @ManyToOne(() => User, user => user.messages)
    user: User

    @ManyToOne(() => Conversation, conversation => conversation.messages)
    conversation: Conversation
}