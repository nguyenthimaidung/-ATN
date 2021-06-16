import fs = require('fs')
import path = require('path')
import { Injectable, UnsupportedMediaTypeException } from '@nestjs/common'
import { AccountService } from '../account/account.service'
import { FileFilterCallback } from 'multer'

export const PUBLIC_FOLDER = path.join(__dirname, '../../public')
export const PRIVATE_UPLOAD_FOLDER = path.join(__dirname, '../../private/upload')
const AVATAR_FOLDER = path.join(PUBLIC_FOLDER, 'avatar')

// make folder
fs.mkdirSync(PRIVATE_UPLOAD_FOLDER, { recursive: true })
fs.mkdirSync(AVATAR_FOLDER, { recursive: true })

// fix ServeStaticModule not found index.html
fs.writeFileSync(path.join(PUBLIC_FOLDER, 'index.html'), '')

const IMAGE_TYPE = ['.png', '.jpg', '.jpeg', '.bmp']
export const MAX_IMAGE_FILE_SIZE = 10 * 1024 * 1024 //10MB

export const imageFilter = (req: Express.Request, file: Express.Multer.File, callback: FileFilterCallback) => {
  const err = !checkMineType(file, 'image') || !checkExtname(file, IMAGE_TYPE)
  if (err) callback(new UnsupportedMediaTypeException('File must be image type.'))
  else callback(null, true)
}

const checkMineType = (file: Express.Multer.File, type: string) => {
  return file.mimetype && file.mimetype.toLowerCase().startsWith(type)
}

const checkExtname = (file: Express.Multer.File, acceptTypes: string[]) => {
  return acceptTypes.includes(path.extname(file.originalname.toLowerCase()))
}

@Injectable()
export class FileService {
  constructor(private readonly accountService: AccountService) {}

  public async uploadAvatar(file: Express.Multer.File, accountId: string, userType) {
    const ext = path.extname(file.originalname.toLowerCase())
    const newFilePath = path.join(AVATAR_FOLDER, file.filename + ext)
    fs.renameSync(file.path, newFilePath)

    // update avatar
    const profile = await this.accountService.getPublicInfo(accountId)
    await this.accountService.updateAvatar(accountId, userType, 'static/avatar/' + file.filename + ext)

    // remove old file
    if (profile.avatar) {
      const filename = path.basename(profile.avatar)
      fs.existsSync(path.join(AVATAR_FOLDER, filename)) && fs.unlinkSync(path.join(AVATAR_FOLDER, filename))
    }

    return await this.accountService.getPublicInfo(accountId)
  }

  public async uploadFiles(files: Express.Multer.File[]) {
    return files.map((file) => {
      const ext = path.extname(file.originalname.toLowerCase())
      return { filename: file.filename + ext, originalname: file.originalname }
    })
  }
}
