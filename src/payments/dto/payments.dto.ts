export class CreatePaymentDto {
  order_id: string
  payment_method: string
  payment_status: string
  voucherUrl?: string
}

export type UpdatePaymentDto = Partial<CreatePaymentDto>;