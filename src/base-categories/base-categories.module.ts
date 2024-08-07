import { Module } from '@nestjs/common';
import { BaseCategoriesService } from './base-categories.service';
import { BaseCategoriesController } from './base-categories.controller';
import { BaseCategory } from './entities/base-category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BaseCategory])],
  controllers: [BaseCategoriesController],
  providers: [BaseCategoriesService],
})
export class BaseCategoriesModule {}
