import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty()
  customer: number;

  createdAt: Date;
  updatedAt: Date;
}
