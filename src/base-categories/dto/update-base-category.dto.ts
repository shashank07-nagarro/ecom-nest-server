import { PartialType } from '@nestjs/swagger';
import { CreateBaseCategoryDto } from './create-base-category.dto';

export class UpdateBaseCategoryDto extends PartialType(CreateBaseCategoryDto) {}
