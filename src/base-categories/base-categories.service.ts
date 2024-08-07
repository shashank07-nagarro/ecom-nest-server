import { Injectable } from '@nestjs/common';
import { CreateBaseCategoryDto } from './dto/create-base-category.dto';
import { UpdateBaseCategoryDto } from './dto/update-base-category.dto';
import { BaseCategory } from './entities/base-category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BaseCategoriesService {
  constructor(
    @InjectRepository(BaseCategory)
    private categoryRepository: Repository<BaseCategory>,
  ) {}

  create(createCategoryDto: CreateBaseCategoryDto) {
    const newUser = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(newUser);
  }

  findAll() {
    return this.categoryRepository.find();
  }

  findOne(id: number) {
    return this.categoryRepository.find({
      where: {
        id,
      },
      relations: ['categories'],
    });
  }

  async update(id: number, updateCategoryDto: UpdateBaseCategoryDto) {
    const user = await this.categoryRepository.findOneBy({ id });
    return this.categoryRepository.save({ ...user, ...updateCategoryDto });
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.categoryRepository.remove(user);
  }
}
