import {
  IsArray,
  IsIn,
  IsString,
  ValidateNested,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OmitType, PartialType } from '@nestjs/mapped-types';

export class ProductsCart {
  @IsString()
  id: string;

  @IsNumber()
  quantity: number;

  @IsString()
  price: string;
}

export class CreateOrderDto {
  @IsString()
  user_id: string;

  @IsOptional()
  @IsString()
  @IsIn(['pending', 'ready', 'completed'])
  status: string;

  @IsOptional()
  @IsString()
  @IsIn(['local', 'delivery'])
  delivery_method: string;

  @IsString()
  total: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductsCart)
  products: ProductsCart[];
}

export class UpdateOrderDto extends OmitType(PartialType(CreateOrderDto), [
  'products',
] as const) {}
