import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { compare, genSalt, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { CreateUserInput } from "./dtos/create-user.input";
import { LoginUserInput } from "./dtos/login-user.input";
import { User } from "./user.entity";
import { UsersService } from './users.service';

@Injectable()
export class AuthService {

    constructor(private usersService: UsersService){}

    async signUpUser(userInfo: CreateUserInput){
        userInfo.password = await this.encryptPassword(userInfo.password)
        const { password, ...newUser } = await this.usersService.saveUser(userInfo)
        const jwtToken = this.generateJWT(newUser)
        return { jwtToken, ...newUser }
    }

    async login(userInfo: LoginUserInput) {
        // get entered email and password and check if they are not empty
        const { email, password: enteredPassword } = userInfo
        if (!email || !enteredPassword) throw new BadRequestException('Invalid credentials')
        // check if there is a user with entered email
        const user = await this.usersService.findUserByEmail(email)
        if (!user) throw new UnauthorizedException('there is no account with this gmail')
        // check the entered password is correct
        await this.checkPassword(enteredPassword, user.password)
        // exclude password from user after checking the password
        const { password, ...loggedInUser } = user
        // create a token with user
        const jwtToken = this.generateJWT(loggedInUser)
        
        return { jwtToken, ...loggedInUser }
    }

    generateJWT(user: Partial<User>) {
        return sign(
            user,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_LIFETIME }
        )
    }

    async encryptPassword(password: string) {
        const salt = await genSalt(10)
        return hash(password, salt)
    }

    async checkPassword(passToCheck: string, encryptedPass: string) {
        const isPasswordCorrect = await compare(passToCheck, encryptedPass)
        if(!isPasswordCorrect) throw new UnauthorizedException('password incorrect')
    }
}