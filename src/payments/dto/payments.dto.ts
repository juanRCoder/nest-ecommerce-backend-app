export class CreatePaymentDto {
  order_id: string
  payment_method: string
  payment_status: string
  voucher?: string
}

export type UpdatePaymentDto = Partial<CreatePaymentDto>;