import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BaseCategoriesService } from './base-categories.service';
import { CreateBaseCategoryDto } from './dto/create-base-category.dto';
import { UpdateBaseCategoryDto } from './dto/update-base-category.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BaseCategory } from './entities/base-category.entity';

@Controller('base-categories')
@ApiTags('base-categories')
export class BaseCategoriesController {
  constructor(private readonly baseCategoriesService: BaseCategoriesService) {}

  @Post()
  @ApiCreatedResponse({ type: BaseCategory })
  create(@Body() createBaseCategoryDto: CreateBaseCategoryDto) {
    return this.baseCategoriesService.create(createBaseCategoryDto);
  }

  @Get()
  @ApiOkResponse({ type: BaseCategory, isArray: true })
  findAll() {
    return this.baseCategoriesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: BaseCategory })
  findOne(@Param('id') id: string) {
    return this.baseCategoriesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: BaseCategory })
  update(
    @Param('id') id: string,
    @Body() updateBaseCategoryDto: UpdateBaseCategoryDto,
  ) {
    return this.baseCategoriesService.update(+id, updateBaseCategoryDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: BaseCategory })
  remove(@Param('id') id: string) {
    return this.baseCategoriesService.remove(+id);
  }
}
