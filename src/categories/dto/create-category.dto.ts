import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsNumber,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  alias: string;

  status?: string;
  createdAt: Date;
  updatedAt: Date;
}
