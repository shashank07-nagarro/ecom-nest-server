import { Test, TestingModule } from '@nestjs/testing';
import { BaseCategoriesService } from './base-categories.service';

describe('BaseCategoriesService', () => {
  let service: BaseCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BaseCategoriesService],
    }).compile();

    service = module.get<BaseCategoriesService>(BaseCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
