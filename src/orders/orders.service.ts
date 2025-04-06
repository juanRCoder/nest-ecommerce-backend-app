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

  async findAll() {
    try {
      const getAllOrders = await this.prisma.order.findMany({
        include: {
          user: true,
          Order_Product: {
            include: {
              product: true,
            },
          },
        },
      });

      return getAllOrders.map((order) => ({
        id: order.id,
        total: order.total,
        status: order.status,
        delivery_method: order.delivery_method,
        user: {
          name: order.user.name
        },
        products: order.Order_Product.map((pr) => ({
          name: pr.product.name,
          quantity: pr.quantity,
          price: pr.price,
          imageUrl: pr.product.imageUrl
        }))
      }));
    } catch (error) {
      throw new InternalServerErrorException('failure to get orders');
    }
  }

  async findOne(id: string) {
    if (!id) {
      throw new BadRequestException('id not found');
    }
    try {
      const getOrder = await this.prisma.order.findUnique({
        where: { id },
        include: {
          user: true,
          Order_Product: {
            include: {
              product: true,
            },
          },
        },
      });

      const { createAt, updateAt, user_id, Order_Product, ...order } = getOrder;
      return {
        ...order,
        user: {
          name: getOrder.user.name
        },
        products: getOrder.Order_Product.map((pr) => ({
          name: pr.product.name,
          quantity: pr.quantity,
          price: pr.price,
          imageUrl: pr.product.imageUrl
        })),
      };
    } catch (error) {
      throw new InternalServerErrorException('failure to get order by id');
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
          include: {
            Order_Product: {
              include: {
                product: true,
              },
            },
          },
        });

        const { createAt, updateAt, ...newOrder } = createdOrder;
        return {
          ...newOrder,
          products: getOrder.Order_Product.map((op) => ({
            product_id: op.product_id,
            name: op.product.name,
            quantity: op.quantity,
            price: op.price,
          })),
        };
      });

      return { message: 'Order created successfully', order };
    } catch (error) {
      throw new InternalServerErrorException('Order creation failed');
    }
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
