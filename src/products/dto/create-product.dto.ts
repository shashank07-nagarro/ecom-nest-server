import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayNotEmpty,
  ArrayMinSize,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  alias: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  mrp: number;

  @ApiProperty()
  color: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ApiProperty()
  categoryIds: number[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ApiProperty()
  genderIds: number[];

  status?: string;
  createdAt: Date;
  updatedAt: Date;
}
