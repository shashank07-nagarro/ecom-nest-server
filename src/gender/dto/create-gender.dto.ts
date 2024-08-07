import { ApiProperty } from '@nestjs/swagger';

export class CreateGenderDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  alias: string;

  status?: string;
  createdAt: Date;
  updatedAt: Date;
}
