import {
  IsArray,
  IsIn,
  IsString,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OmitType, PartialType } from '@nestjs/mapped-types';

export class ProductsCart {
  @IsString()
  id: string;

  @IsNumber()
  quantity: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;
}

export class CreateOrderDto {
  @IsString()
  user_id: string;

  @IsString()
  @IsIn(['pending', 'ready', 'completed'])
  status: string;

  @IsString()
  @IsIn(['local', 'delivery'])
  delivery_method: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  total: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductsCart)
  products: ProductsCart[];
}

export class UpdateOrderDto extends OmitType(PartialType(CreateOrderDto), [
  'products',
] as const) {}
