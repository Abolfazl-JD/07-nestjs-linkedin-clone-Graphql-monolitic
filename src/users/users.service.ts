import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dtos/create-user.input';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>){}

    saveUser(userInfo: Partial<User>) {
        return this.usersRepository.save(userInfo)
    }

    async updateUserImage(id: number, imagePath: string) {
        const user = await this.getSingleUserById(id)
        user.imagePath = imagePath
        return this.usersRepository.save(user)
    }

    async getSingleUserById(id: number) {
        const user = await this.usersRepository.findOneBy({ id })
        if (!user) throw new NotFoundException('user not found')
        return user
    }

    findUserByEmail(email: string) {
        return this.usersRepository.findOneBy({ email })
    }
}
