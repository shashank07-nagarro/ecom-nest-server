import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { BaseCategory } from 'src/base-categories/entities/base-category.entity';
import { BaseCategoriesModule } from 'src/base-categories/base-categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, BaseCategory]),
    BaseCategoriesModule,
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
