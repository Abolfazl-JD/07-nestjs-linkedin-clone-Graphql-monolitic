import { User } from "../../users/user.entity";
import { Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Message } from "./message.entity";
import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
@Entity('conversations')
export class Conversation {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number

    @UpdateDateColumn()
    @Field(() => Date)
    lastUpdate: Date

    @Field(() => [User], { nullable: true })
    @JoinTable()
    @ManyToMany(() => User, user => user.conversations)
    users: User[]

    @Field(() => [Message], { nullable: true })
    @OneToMany(() => Message, message => message.conversation)
    messages: Message[]
}