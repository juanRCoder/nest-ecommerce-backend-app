export interface CreateProductDto {
  name: string
  description: string
  category: string[]
  price: number
  stock: number
  minStock: number
  unitPrice: number
  status: 'available' | 'unavailable'
  imageUrl?: string
}

export type UpdateProductDto = Partial<CreateProductDto>;
