import { PartialType } from '@nestjs/mapped-types';
import { CreateCartDto } from './create-cart.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdateCartDto extends PartialType(CreateCartDto) {
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
