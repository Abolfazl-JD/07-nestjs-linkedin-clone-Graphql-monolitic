import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
const fileType = require('file-type')

const allowedMimeTypes = ['image/png', 'image/jpg', 'image/jpeg']

export const multerConfigOptions: MulterOptions = {
    storage: diskStorage({
        destination: './images',
        filename(req, file, callback) {
            const ext = extname(file.originalname)
            const fileName = uuid() + ext
            callback(null, fileName)
        },
    }),
    fileFilter(req, file, callback) {
        allowedMimeTypes.includes(file.mimetype) ? callback(null, true) : callback(null, false)
    }
}

export const isImageExtSafe = async (fullImagePath: string) => {
    const fileInfo = await fileType.fromFile(fullImagePath)
    if (!fileInfo) return false

    const isFileExtSafe = ['png', 'jpg', 'jpeg'].includes(fileInfo.ext)
    const isFileMimeSafe = allowedMimeTypes.includes(fileInfo.mime)
    
    return isFileExtSafe && isFileMimeSafe
}