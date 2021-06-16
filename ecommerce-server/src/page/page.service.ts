import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Page } from './page.entity'
import { UpdatePageDto } from './page.dto'
import { Errors } from '../share/error.code'

@Injectable()
export class PageService {
  constructor(
    @InjectRepository(Page)
    private readonly pageRepo: Repository<Page>,
  ) {}

  public async update(createPageDto: UpdatePageDto) {
    const page = Object.assign(new Page(), createPageDto)
    return await this.pageRepo.save(page)
  }

  public async delete(path: string) {
    await this.pageRepo.softDelete(path)
  }

  public async get(path: string) {
    return await this.pageRepo.findOne({ path })
  }
}
