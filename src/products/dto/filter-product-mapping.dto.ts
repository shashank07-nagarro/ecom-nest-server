import { ApiProperty } from '@nestjs/swagger';

export class FilterProductMappingDto {
  @ApiProperty()
  genderId?: number;

  @ApiProperty()
  categoryId?: number;

  @ApiProperty()
  baseCategoryId?: number;

  @ApiProperty()
  category?: string;

  @ApiProperty()
  gender?: string;

  @ApiProperty()
  minPrice?: number;

  @ApiProperty()
  maxPrice?: number;

  @ApiProperty()
  color?: string[];
}
