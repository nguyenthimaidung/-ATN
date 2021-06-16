import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindConditions, Like, Repository } from 'typeorm'

import { Author } from './author.entity'
import { CreateAuthorDto, FindAuthorDto, UpdateAuthorDto } from './author.dto'
import { Errors } from '../share/error.code'
import { dataFeild, paginationFeild } from '../share/common'

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepo: Repository<Author>,
  ) {}

  private async isExists(id: number, throwError?: any) {
    const count = await this.authorRepo.count({ where: { id } })
    if (count === 0 && throwError) {
      throw throwError
    }
    return count > 0
  }

  public async create(createAuthorDto: CreateAuthorDto) {
    const author = Object.assign(new Author(), createAuthorDto)
    return await this.authorRepo.save(author)
  }

  public async update(id: number, updateAuthorDto: UpdateAuthorDto) {
    await this.isExists(id, new NotFoundException(Errors.notExists('Author')))
    await this.authorRepo.update(id, updateAuthorDto)
    return await this.authorRepo.findOne({ id })
  }

  public async delete(id: number) {
    await this.authorRepo.softDelete(id)
  }

  public async get(id: number) {
    await this.isExists(id, new NotFoundException(Errors.notExists('Author')))
    return await this.authorRepo.findOne({ id })
  }

  public async getRandoms(take?: number) {
    take = take || 5
    return await this.authorRepo.createQueryBuilder().orderBy('RAND()').take(take).getMany()
  }

  public async getAll(findInfo: FindAuthorDto, page?: number, take?: number) {
    page = page || 0
    take = take || 20
    const where: FindConditions<Author> = {}
    if (findInfo.search) where.name = Like(`%${findInfo.search}%`)
    const [data, total] = await this.authorRepo.findAndCount({ where, skip: page * take, take })
    const result = {}
    result[paginationFeild] = { total, page, take }
    result[dataFeild] = data
    return result
  }

  public toAuthorInfoInfos(categories: Author[]) {
    return categories.map((item) => {
      return this.toAuthorInfoInfo(item)
    })
  }

  public toAuthorInfoInfo(author: Author) {
    const { createdAt, updatedAt, deleteAt, ...authorInfo } = author
    return authorInfo
  }
}
