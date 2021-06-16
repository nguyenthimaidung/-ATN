import { Injectable, HttpException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Category } from './category.entity'
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto'
import { Errors } from '../share/error.code'
import { dataFeild, paginationFeild } from '../share/common'

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  private async isExists(id: number, throwError?: any) {
    const count = await this.categoryRepo.count({ where: { id } })
    if (count === 0 && throwError) {
      throw throwError
    }
    return count > 0
  }

  public async create(createCategoryDto: CreateCategoryDto) {
    const category = Object.assign(new Category(), createCategoryDto)
    return await this.categoryRepo.save(category)
  }

  public async update(id: number, createCategoryDto: UpdateCategoryDto) {
    await this.isExists(id, new NotFoundException(Errors.notExists('Category')))
    const { parentId } = createCategoryDto
    parentId !== null &&
      parentId !== undefined &&
      (await this.isExists(createCategoryDto.parentId, new NotFoundException(Errors.notExists('Parent category'))))
    await this.categoryRepo.update(id, createCategoryDto)
    return await this.categoryRepo.findOne({ id })
  }

  public async delete(id: number) {
    await this.categoryRepo.update({ parentId: id }, { parentId: null })
    await this.categoryRepo.softDelete(id)
  }

  public async getCategories() {
    return this.toCategoryInfoInfos(
      await this.categoryRepo.find({ where: { parentId: null }, relations: ['child', 'child.child'] }),
    )
  }

  public async getAll() {
    return await this.categoryRepo.find()
  }

  public toCategoryInfoInfos(categories: Category[]) {
    return categories.map((item) => {
      return { ...this.toCategoryInfoInfo(item), child: item.child && this.toCategoryInfoInfos(item.child) }
    })
  }

  public toCategoryInfoInfo(category: Category) {
    const { createdAt, updatedAt, deleteAt, ...categoryInfo } = category
    return categoryInfo
  }
}
