import { Controller, Post, UploadedFile, UseGuards, UseInterceptors, Request, NotAcceptableException, BadRequestException, ClassSerializerInterceptor, Get, Res, NotFoundException, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthorizationGuard } from './../guards/authorization.guard';
import { isImageExtSafe, multerConfigOptions } from './../multer.config';
import { join } from 'path';
import { UsersService } from './users.service';
import { unlinkSync } from 'fs';

@Controller('/api/v1/users')
export class UsersController {

    constructor(private usersService: UsersService){}

    @UseGuards(AuthorizationGuard)
    @Post('file')
    @UseInterceptors(FileInterceptor('file', multerConfigOptions), ClassSerializerInterceptor)
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req: any) {
        // check if the file extension is image type
        if (!file) throw new BadRequestException('file must be a png or jpg/jpeg')
        const { filename } = file
        // check if the file extension is safe
        const fullFilePath = join(process.cwd(), 'images/', filename)
        const isImgExtSafe = await isImageExtSafe(fullFilePath)
        
        if (isImgExtSafe) return this.usersService.updateUserImage((req.user.id) as number, filename)
        unlinkSync(fullFilePath)
        throw new BadRequestException('the file content does not match its extension')
    }

    @UseGuards(AuthorizationGuard)
    @Get('image-path')
    async getUserImage(@Request() req: any) {
        const { imagePath } = await this.usersService.getSingleUserById(req.user.id)
        return imagePath
    }

    @Get('image/:filename')
    getImage(@Param('filename') filename: string, @Res() res: any) {
        let imgPath = ''
        if (!filename || ['null', '[null]', 'undefined'].includes(filename))
            imgPath = 'fd7a6g86f3d24ip7m2dw4.png'
        else imgPath = filename
        return res.sendFile(imgPath, { root: './images' })
    }
}
