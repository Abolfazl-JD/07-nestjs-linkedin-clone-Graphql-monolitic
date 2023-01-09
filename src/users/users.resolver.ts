import { Args, Context, Mutation, Resolver, Query, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserInput } from './dtos/create-user.input';
import { User } from './user.entity';
import { LoginUserInput } from './dtos/login-user.input';
import { UseGuards, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { AuthorizationGuard } from './../guards/authorization.guard';
import { AuthService } from './auth.service';

@Resolver(() => User)
export class UsersResolver {

    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ) { }

    @Mutation(() => User)
    registerUser(@Args('createUserInput') userInfo: CreateUserInput) {
        return this.authService.signUpUser(userInfo)
    }

    @Mutation(() => User)
    loginUser(@Args('loginUserInput') userInfo: LoginUserInput) {
        return this.authService.login(userInfo)
    }
    
    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(AuthorizationGuard)
    @Query(() => User, { name: 'user' })
    getSingleUser(@Args({ name: 'id', type: () => Int }) id: number) {
        return this.usersService.getSingleUserById(id)
    }
}
