import {
  IsArray,
  IsDecimal,
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

  @IsDecimal()
  price: number;
}

export class CreateOrderDto {
  @IsString()
  user_id: string;

  @IsString()
  @IsIn(['pending', 'ready', 'completed'])
  status: 'pending' | 'ready' | 'completed';

  @IsString()
  @IsIn(['local', 'delivery'])
  delivery_method: 'local' | 'delivery';

  @IsDecimal()
  total: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductsCart)
  products: ProductsCart[];
}

export class UpdateOrderDto extends OmitType(PartialType(CreateOrderDto), [
  'products',
] as const) {}
