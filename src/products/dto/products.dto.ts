import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsDecimal, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string

  @IsString()
  description: string

  @IsArray()
  @IsString({ each: true })
  category: string[];

  @IsDecimal()
  price: number

  @IsNumber()
  stock: number

  @IsNumber()
  minStock: number

  @IsString()
  @IsIn(['available', 'unavailable'])
  status: 'available' | 'unavailable'

  @IsOptional()
  @IsString()
  imageUrl?: string
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
