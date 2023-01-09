import { Field, InputType, Int } from "@nestjs/graphql"
import { IsNumber, IsOptional } from "class-validator"

@InputType()
export class GetFeedsInput {
    @IsOptional()
    @IsNumber()
    @Field(() => Int, { nullable: true })
    skip: number

    @IsOptional()
    @IsNumber()
    @Field(() => Int, { nullable: true })
    take: number
}