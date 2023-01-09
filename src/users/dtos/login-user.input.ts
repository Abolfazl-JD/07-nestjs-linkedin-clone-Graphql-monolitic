import { Field, InputType } from "@nestjs/graphql"
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"

@InputType()
export class LoginUserInput {
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