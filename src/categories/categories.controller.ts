import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Category } from './entities/category.entity';

@Controller('categories')
@ApiTags('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post(':baseCategoryId')
  @ApiCreatedResponse({ type: Category })
  create(
    @Param('baseCategoryId') baseCategoryId: number,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    if (!baseCategoryId) {
      throw new BadRequestException('Base Category ID is required');
    }

    return this.categoriesService.create(createCategoryDto, baseCategoryId);
  }

  @Get()
  @ApiOkResponse({ type: Category, isArray: true })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: Category })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: Category })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: Category })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
