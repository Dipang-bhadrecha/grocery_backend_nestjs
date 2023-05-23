import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
export class CreateCartDto {
  @ApiProperty()
  @IsNumber()
  product_id: number;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  qty: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;
}
