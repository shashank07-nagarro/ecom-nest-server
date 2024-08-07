import { ApiProperty } from '@nestjs/swagger';

export class CreateBaseCategoryDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  alias: string;

  status?: string;
  createdAt: Date;
  updatedAt: Date;
}
