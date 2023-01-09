import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'

@InputType()
export class CreateFeedInput {
    @Field()
    @IsNotEmpty()
    body: string
}