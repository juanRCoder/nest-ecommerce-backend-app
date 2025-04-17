import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payments.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async findAllPayments() {
    try {
      const payments = await this.prisma.payment.findMany();
      if (payments.length === 0) {
        return { message: 'No payments found' };
      }

      return payments;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Error finding all payments',
        error,
      );
    }
  }

  async findOnePayment(id: string) {
    try {
      const payment = await this.prisma.payment.findUnique({
        where: { id },
        include: {
          order: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!payment) {
        throw new NotFoundException(
          `Payment with ID ${id} not found or has been deleted`,
        );
      }

      const { updateAt, order_id, ...newPayment } = payment;
      return {
        ...newPayment,
        order: {
          id: payment.order.id,
          total: payment.order.total,
          status: payment.order.status,
          delivery_method: payment.order.delivery_method,
        },
        user: {
          id: payment.order.user.id,
          name: payment.order.user.name,
          phone: payment.order.user.phone,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Payment get for id failed',
        error,
      );
    }
  }

  async createPayment(createPaymentDto: CreatePaymentDto) {
    try {
      const payment = await this.prisma.$transaction(async (prisma) => {
        const createdPayment = await prisma.payment.create({
          data: { ...createPaymentDto },
        });

        const getVoucher = await prisma.payment.findUnique({
          where: { id: createdPayment.id },
          include: {
            order: {
              include: {
                user: true,
                Order_Product: {
                  include: {
                    product: true,
                  },
                },
              },
            },
          },
        });

        if (!getVoucher || !getVoucher.order) {
          throw new NotFoundException('Payment or associated order not found');
        }

        const { updateAt, order_id, ...newPayment } = getVoucher;

        return {
          ...newPayment,
          order: {
            id: getVoucher.order.id,
            total: getVoucher.order.total,
            status: getVoucher.order.status,
            delivery_method: getVoucher.order.delivery_method,
          },
          user: {
            id: getVoucher.order.user.id,
            name: getVoucher.order.user.name,
            phone: getVoucher.order.user.phone,
          },
          products: getVoucher.order.Order_Product.map((pr) => ({
            name: pr.product.name,
            quantity: pr.quantity,
            price: pr.price,
            imageUrl: pr.product.imageUrl,
          })),
        };
      });

      return { message: 'Payment created successfully', payment };
    } catch (error) {
      throw new InternalServerErrorException('Payment creation failed', error);
    }
  }

  async updatePayment(id: string, updatePaymentDto: UpdatePaymentDto) {
    try {
      const existingPayment = await this.prisma.payment.findUnique({
        where: { id },
      });

      if (!existingPayment) {
        throw new NotFoundException(`Payment with ID ${id} not found`);
      }

      await this.prisma.payment.update({
        where: { id },
        data: updatePaymentDto,
      });

      return { message: 'Payment updated successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update a Payment',
        error,
      );
    }
  }

  async confirmPayment(id: string, updatePaymentDto: UpdatePaymentDto) {
    try {
      if (!updatePaymentDto.payment_status) {
        throw new NotFoundException('Payment status is required');
      }
      const existingPayment = await this.prisma.payment.findUnique({
        where: { id },
      });

      if (!existingPayment) {
        throw new NotFoundException(`Payment with ID ${id} not found`);
      }
      if (existingPayment.payment_status === 'completed') {
        return {
          message: `This payment with ID ${id} it was already confirmed`,
        };
      }

      const updatedPayment = await this.prisma.payment.update({
        where: { id },
        data: updatePaymentDto,
      });

      const orderProducts = await this.prisma.order_Product.findMany({
        where: { order_id: updatedPayment.order_id },
        include: {
          product: true,
        },
      });

      const stockUpdates = orderProducts.map(({ product, quantity }) =>
        this.prisma.product.update({
          where: { id: product.id },
          data: {
            stock: product.stock - quantity,
          },
        }),
      );

      await this.prisma.$transaction(stockUpdates);

      return { message: 'Payment confirmed and stock updated' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      console.error('Error confirming payment:', error);
      throw new InternalServerErrorException('Failed to confirm payment');
    }
  }

  async removePayment(id: string) {
    try {
      const existingPayment = await this.prisma.payment.findUnique({
        where: { id },
      });

      if (!existingPayment) {
        throw new NotFoundException(`Payment with ID ${id} not found`);
      }

      await this.prisma.payment.delete({
        where: { id },
      });

      return { message: 'removed payment successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Failed to remove a payment',
        error,
      );
    }
  }
}
