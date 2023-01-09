import { Field, InputType } from "@nestjs/graphql"
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator"

@InputType()
export class CreateUserInput {
    @IsOptional()
    @IsString()
    @MinLength(1)
    @Field({ nullable: true })
    firstName: string

    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @Field()
    lastName: string

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @Field()
    email: string

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(30)
    @Field()
    password: string
}