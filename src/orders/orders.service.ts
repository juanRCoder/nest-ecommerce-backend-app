import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from './dto/orders.dto';
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
        id: order.user.id,
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

  async findAllOrders() {
    try {
      const orders = await this.prisma.order.findMany({
        select: {
          id: true,
          total: true,
          status: true,
          delivery_method: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return orders;
    } catch (error) {
      throw new InternalServerErrorException('Error finding all orders', error);
    }
  }

  async findOneOrder(id: string) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
        include: this.orderInclude,
      });

      if (!order) {
        throw new NotFoundException(
          `Order with ID ${id} not found or has been deleted`,
        );
      }

      return this.formatOrder(order);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Failure to get order by ID',
        error,
      );
    }
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    const { products, ...createOrder } = createOrderDto;

    if (!products || products.length < 1) {
      throw new NotFoundException('Products not found');
    }

    const productIds = products.map((p) => p.id);
    const existingProducts = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true },
    });

    const existingIds = new Set(existingProducts.map((p) => p.id));
    const invalidProducts = products.filter((p) => !existingIds.has(p.id));

    if (invalidProducts.length > 0) {
      const ids = invalidProducts.map((p) => p.id).join(', ');
      throw new NotFoundException(
        `The following products ids are not found: ${ids}`,
      );
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
      throw new InternalServerErrorException('Order creation failed', error);
    }
  }

  async updateOrder(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      const existingOrder = await this.prisma.order.findUnique({
        where: { id },
      });

      if (!existingOrder) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      await this.prisma.order.update({
        where: { id },
        data: updateOrderDto,
      });

      return { message: 'updated order successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update a order', error);
    }
  }
  async updateStatusOrder(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      if (!id) {
        throw new NotFoundException('Order ID is required');
      }
      if (!updateOrderDto.status) {
        throw new NotFoundException('Order status is required');
      }
      const allowedStatuses = ['pending', 'ready', 'completed'];
      if (!allowedStatuses.includes(updateOrderDto.status)) {
        throw new BadRequestException(`Invalid order status: ${updateOrderDto.status}`);
      }

      const existingOrder = await this.prisma.order.findUnique({
        where: { id },
      });

      if (!existingOrder) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      await this.prisma.order.update({
        where: { id },
        data: updateOrderDto
      });

      return { message: 'Order status updated successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('Error updating order status:', error);
      throw new InternalServerErrorException('Failed to update the order');
    }
  }

  async removeOrder(id: string) {
    try {
      const existingOrder = await this.prisma.order.findUnique({
        where: { id },
      });

      if (!existingOrder) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      await this.prisma.order_Product.deleteMany({
        where: { order_id: id },
      });

      await this.prisma.order.delete({
        where: { id },
      });

      return { message: 'removed order successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to remove a order', error);
    }
  }
}
