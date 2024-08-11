import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Gender } from 'src/gender/entities/gender.entity';
import { FilterProductMappingDto } from './dto/filter-product-mapping.dto';
import { BaseCategory } from 'src/base-categories/entities/base-category.entity';
import { SearchService } from 'src/search/search.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Gender)
    private readonly genderRepository: Repository<Gender>,
    @InjectRepository(BaseCategory)
    private baseCategoryRepository: Repository<BaseCategory>,
    private readonly searchService: SearchService,
  ) {}
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const {
      title,
      alias,
      description,
      price,
      categoryIds,
      genderIds,
      mrp,
      color,
    } = createProductDto;

    // Fetch categories by IDs
    const categories = await this.categoryRepository.findByIds(categoryIds);

    // Check if all requested categories exist
    if (categories.length !== categoryIds.length) {
      throw new BadRequestException('One or more categories not found');
    }

    // Fetch categories by IDs
    const genders = await this.genderRepository.findByIds(genderIds);

    // Check if all requested categories exist
    if (genders.length !== genderIds.length) {
      throw new BadRequestException('One or more categories not found');
    }

    // Create product instance and assign categories
    const product = new Product();
    product.title = title;
    product.alias = alias;
    product.description = description;
    product.price = price;
    product.mrp = mrp;
    product.color = color;
    product.categories = categories;
    product.genders = genders;

    const data = await this.productRepository.save(product);
    await this.searchService.indexProduct(data);
    return data;
  }

  async findAll() {
    const queryBuilder: SelectQueryBuilder<Product> = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'category')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.genders', 'gender');
    return await queryBuilder.getMany();
  }

  async findOne(id: number) {
    return this.productRepository.findOne({
      where: {
        id,
      },
      relations: ['images', 'categories', 'genders'],
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const user = await this.productRepository.findOneBy({ id });
    const data = await this.productRepository.save({
      ...user,
      ...updateProductDto,
    });
    const jsonData = await this.findOne(id);
    await this.searchService.updateProduct(jsonData, id);
    return data;
  }

  async remove(id: number) {
    const user = await this.productRepository.findOneBy({ id });
    const data = this.productRepository.remove(user);
    await this.searchService.remove(id);
    return data;
  }

  async findByFilters(filter: FilterProductMappingDto): Promise<Product[]> {
    const { categoryId, genderId, baseCategoryId, category, gender } = {
      ...filter,
    };
    let baseCategoryArr = [];
    if (baseCategoryId) {
      // Retrieve the base category
      const baseCategory = await this.baseCategoryRepository.findOne({
        where: {
          id: baseCategoryId,
        },
        relations: ['categories'],
      });

      baseCategoryArr = baseCategory
        ? baseCategory.categories.map((cat) => cat.id)
        : [];
    }

    const queryBuilder: SelectQueryBuilder<Product> = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'category')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.genders', 'gender');

    if (baseCategoryArr.length) {
      queryBuilder.andWhereInIds(baseCategoryArr);
    } else if (categoryId) {
      queryBuilder.andWhere('category.id = :categoryId', { categoryId });
    } else if (category) {
      queryBuilder.andWhere('category.alias = :alias', {
        alias: category,
      });
    }

    if (genderId) {
      queryBuilder.andWhere('gender.id = :genderId', { genderId });
    } else if (gender) {
      queryBuilder.andWhere('gender.alias = :genderalias', {
        genderalias: gender,
      });
    }

    return await queryBuilder.getMany();
  }

  async findByFiltersES(filter: FilterProductMappingDto) {
    const {
      categoryId,
      genderId,
      baseCategoryId,
      category,
      gender,
      minPrice,
      maxPrice,
      color = [],
    } = {
      ...filter,
    };
    let query: { bool: { must: any[]; filter?: {} } } = {
      bool: {
        must: [],
      },
    };
    if (category || gender || minPrice || maxPrice || color.length) {
      if (category) {
        query.bool.must.push({
          term: {
            'categories.alias.keyword': category.toLowerCase(),
          },
        });
      }
      if (gender) {
        query.bool.must.push({
          term: {
            'genders.alias.keyword': gender.toLowerCase(),
          },
        });
      }
      if (color.length) {
        query.bool.filter = {
          terms: {
            color: color,
          },
        };
      }
      if (minPrice > -1 && maxPrice > -1) {
        query.bool.must.push({
          range: {
            price: {
              gte: minPrice,
              lte: maxPrice,
            },
          },
        });
      }
    }
    return await this.searchService.getAll(query);
  }
}
