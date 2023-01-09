import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from '../users/user.entity';

export enum StatusEnum {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    DECLINED = 'declined'
}


@ObjectType()
@Entity('connection_requests')
export class ConnectionRequest {
    @PrimaryGeneratedColumn()
    @Field(() => Int, { nullable: true })
    id: number

    @Column({ type: 'enum', enum: StatusEnum, default: StatusEnum.PENDING })
    @Field(() => String, { defaultValue: 'pending' })
    status: StatusEnum

    @Field(() => User, { nullable: true })
    @ManyToOne(() => User, user => user.sentConnectRequests)
    creator: User

    @Field(() => User, { nullable: true })
    @ManyToOne(() => User, user => user.recievedConnectRequests)
    reciever: User
}
