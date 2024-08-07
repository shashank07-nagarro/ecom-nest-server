import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCategory } from 'src/base-categories/entities/base-category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(BaseCategory)
    private baseCategoryRepository: Repository<BaseCategory>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, baseCategoryId: number) {
    // Retrieve the base category
    const baseCategory = await this.baseCategoryRepository.findOneBy({
      id: baseCategoryId,
    });
    if (!baseCategory) {
      throw new BadRequestException('Base Category not found');
    }

    // Create new category and associate with base category
    const category = new Category();
    category.title = createCategoryDto.title;
    category.alias = createCategoryDto.alias;
    category.baseCategory = baseCategory;

    const newUser = this.categoryRepository.create(category);
    return this.categoryRepository.save(newUser);
  }

  findAll() {
    return this.categoryRepository.find();
  }

  findOne(id: number) {
    return this.categoryRepository.findOneBy({ id });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const user = await this.categoryRepository.findOneBy({ id });
    return this.categoryRepository.save({ ...user, ...updateCategoryDto });
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.categoryRepository.remove(user);
  }
}
