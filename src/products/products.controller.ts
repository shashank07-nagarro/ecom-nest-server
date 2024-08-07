import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Product } from './entities/product.entity';
import { FilterProductMappingDto } from './dto/filter-product-mapping.dto';
import { SearchService } from 'src/search/search.service';
import { SearchProductDto } from 'src/search/dto/search-product.dto';

@Controller('products')
@ApiTags('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly searchService: SearchService,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: Product })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOkResponse({ type: Product, isArray: true })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: Product })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: Product })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: Product })
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  @Post('filter')
  async getProductsByFilters(@Body() filter: FilterProductMappingDto) {
    return await this.productsService.findByFiltersES(filter);
  }

  @Post('search')
  async search(@Body() body: SearchProductDto) {
    return await this.searchService.search(body);
  }
}
