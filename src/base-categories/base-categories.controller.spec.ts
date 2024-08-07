import { Test, TestingModule } from '@nestjs/testing';
import { BaseCategoriesController } from './base-categories.controller';
import { BaseCategoriesService } from './base-categories.service';

describe('BaseCategoriesController', () => {
  let controller: BaseCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BaseCategoriesController],
      providers: [BaseCategoriesService],
    }).compile();

    controller = module.get<BaseCategoriesController>(BaseCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
