import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from './dto/orders.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return `This action returns all orders`;
  }

  async create(createOrderDto: CreateOrderDto) {
    const { products, ...createOrder } = createOrderDto;

    if (!products || products.length < 1) {
      throw new BadRequestException('Products not found');
    }

    try {
      await this.prisma.$transaction(async (prisma) => {
        const newOrder = await prisma.order.create({
          data: { ...createOrder },
        });

        await prisma.order_Product.createMany({
          data: products.map((pr) => ({
            order_id: newOrder.id,
            product_id: pr.id,
            quantity: pr.quantity,
            price: pr.price,
          })),
        });

        return undefined; // Explicitamos que no se retorna nada
      });
      
      return { message: 'Order created successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Order creation failed');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
