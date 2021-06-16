import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateAccountDto, FindAccountDto } from '../account/account.dto'
import { Account } from '../account/account.entity'
import { Repository } from 'typeorm'

import { Admin } from './admin.entity'
import { UpdateAdminProfileDto } from './admin.dto'
import { Errors } from '../share/error.code'

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
  ) {}

  public async getPublicInfo(id: string) {
    return this.adminRepo
      .findOneOrFail({ id })
      .catch(() => {
        throw new NotFoundException()
      })
      .then((admin) => this.toPublicInfo(admin))
  }

  public async create(createAccountDto: CreateAccountDto, account: Account) {
    const existedAdmin = await this.adminRepo.findOne({
      id: account.id,
    })
    if (existedAdmin) {
      throw new ConflictException(Errors.CONFLICT_EMAIL)
    }

    const admin = new Admin()
    admin.id = account.id
    admin.name = createAccountDto.name
    admin.email = account.email

    return this.toPublicInfo(await this.adminRepo.save(admin))
  }

  private async isExists(id: number, throwError?: any) {
    const count = await this.adminRepo.count({ where: { id } })
    if (count === 0 && throwError) {
      throw throwError
    }
    return count > 0
  }

  public async get(admin: Admin | string) {
    if (!(admin instanceof Admin)) {
      const id = admin
      admin = await await this.adminRepo.findOne({ id })
    }
    if (!admin) {
      throw new NotFoundException(Errors.notExists('Admin'))
    }
    return admin
  }

  public async getProfile(id) {
    const existedAdmin = await this.get(id)
    return this.toProfileInfo(existedAdmin)
  }

  public async updateProfile(id, updateAdminProfileDto: UpdateAdminProfileDto | { avatar: string }) {
    await this.isExists(id, new NotFoundException(Errors.notExists('Admin')))
    await this.adminRepo.update(id, updateAdminProfileDto)
    return this.toProfileInfo(await this.adminRepo.findOne({ id }))
  }

  private toPublicInfo(admin: Admin) {
    const { createdAt, updatedAt, deleteAt, phone, email, ...publicInfo } = admin
    return publicInfo
  }

  private toProfileInfo(admin: Admin) {
    const { createdAt, updatedAt, deleteAt, ...profileInfo } = admin
    return profileInfo
  }

  public async getAll(findInfo: FindAccountDto, page?: number, take?: number) {
    page = page || 0
    take = take || 20
    const { search, state } = findInfo

    let query = this.adminRepo.createQueryBuilder('admin')

    if (search !== undefined) {
      query = query.where('(admin.name LIKE :name OR admin.phone LIKE :phone OR admin.email LIKE :email)', {
        name: `%${search}%`,
        phone: `%${search}%`,
        email: `%${search}%`,
      })
    }

    query = query.leftJoinAndSelect('admin.account', 'account')

    if (state !== undefined) query = query.andWhere('account.state = :state', { state: state })

    query = query.skip(page * take).take(take)

    return await query.getManyAndCount()
  }
}
