interface ProductsCart {
  id: string;
  quantity: number;
  price: number;
}

export interface CreateOrderDto {
  user_id: string;
  status: 'pending' | 'preparing' | 'ready';
  delivery_method: 'local' | 'delivery';
  products: ProductsCart[];
  total: number;
}

export type UpdateOrderDto = Partial<Omit<CreateOrderDto, 'products'>>;
