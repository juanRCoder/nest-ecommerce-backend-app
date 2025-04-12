import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/orders.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  private orderInclude = {
    user: true,
    Order_Product: {
      include: {
        product: true,
      },
    },
  };
  
  private formatOrder(order: any) {
    return {
      id: order.id,
      total: order.total,
      status: order.status,
      delivery_method: order.delivery_method,
      user: {
        name: order.user.name,
      },
      products: order.Order_Product.map((pr) => ({
        name: pr.product.name,
        quantity: pr.quantity,
        price: pr.price,
        imageUrl: pr.product.imageUrl,
      })),
    };
  }

  async findAll() {
    try {
      const orders = await this.prisma.order.findMany({
        include: this.orderInclude,
      });

      return orders.map(this.formatOrder);
    } catch (error) {
      throw new InternalServerErrorException('get orders failured');
    }
  }

  async findOne(id: string) {
    if (!id) throw new BadRequestException('ID not found');
  
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
        include: this.orderInclude,
      });
  
      return this.formatOrder(order);
    } catch (error) {
      throw new InternalServerErrorException('Failure to get order by ID');
    }
  }

  async create(createOrderDto: CreateOrderDto) {
    const { products, ...createOrder } = createOrderDto;
  
    if (!products || products.length < 1) {
      throw new BadRequestException('Products not found');
    }
  
    try {
      const order = await this.prisma.$transaction(async (prisma) => {
        const createdOrder = await prisma.order.create({
          data: { ...createOrder },
        });
  
        await prisma.order_Product.createMany({
          data: products.map((pr) => ({
            order_id: createdOrder.id,
            product_id: pr.id,
            quantity: pr.quantity,
            price: pr.price,
          })),
        });
  
        const getOrder = await prisma.order.findUnique({
          where: { id: createdOrder.id },
          include: this.orderInclude,
        });
  
        return this.formatOrder(getOrder);
      });
  
      return { message: 'Order created successfully', order };
    } catch (error) {
      throw new InternalServerErrorException('Order creation failed');
    }
  }

  // update(id: number, updateOrderDto: UpdateOrderDto) {
  //   return `This action updates a #${id} order`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} order`;
  // }
}
