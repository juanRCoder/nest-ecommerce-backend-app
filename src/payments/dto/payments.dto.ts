import { PartialType } from '@nestjs/mapped-types';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  order_id: string;

  @IsOptional()
  @IsString()
  @IsIn(['bank account', 'cash'])
  payment_method: string;

  @IsOptional()
  @IsString()
  @IsIn(['pending', 'completed', 'failed', 'canceled'])
  payment_status: string;

  @IsOptional()
  @IsString()
  voucherUrl?: string;
}

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {}
