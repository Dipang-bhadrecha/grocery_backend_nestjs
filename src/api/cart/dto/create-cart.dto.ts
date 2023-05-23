import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';
export class CreateCartDto {
  @ApiProperty()
  @IsNumber()
  product_id: number;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  qty: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  price: number;
}

