import { ObjectType, Field, Int } from '@nestjs/graphql'
import { User } from '../users/user.entity';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@ObjectType()
@Entity('feeds')
export class Feed {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number

    @Column({ nullable: true })
    @Field({ nullable: true })
    body: string

    @Field()
    @CreateDateColumn()
    createdAt: Date
    
    @Field(() => User)
    @ManyToOne(() => User, user => user.feeds)
    author: User
}