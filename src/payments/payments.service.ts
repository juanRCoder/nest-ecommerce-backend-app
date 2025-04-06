import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payments.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return `This action returns all payments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  async create(createPaymentDto: CreatePaymentDto) {
    try {
      const payment = await this.prisma.$transaction(async (prisma) => {
        const createdPayment = await prisma.payment.create({
          data: { ...createPaymentDto },
        });

        const getVoucher = await prisma.payment.findUnique({
          where: { id: createdPayment.id },
          include: { // Order table for order_id
            order: {
              include: { // > relation Order_Product table for product_id && User table for user_id
                user: true,
                Order_Product: {
                  include: { // > relation Product table
                    product: true,
                  },
                },
              },
            },
          },
        });

        const { updateAt, order_id, ...newPayment } = getVoucher;
        return {
          ...newPayment,
          order: {
            id: newPayment.order.id,
            total: newPayment.order.total,
            status: newPayment.order.status,
            delivery_method: newPayment.order.delivery_method
          },
          user: {
            name: newPayment.order.user.name
          },
          products: newPayment.order.Order_Product.map(pr => ({
            name: pr.product.name,
            quantity: pr.quantity,
            price: pr.price,
            imgUrl: pr.product.price
          }))
        };
      });
      return { message: 'Payment created successfully', payment };
    } catch (error) {
      throw new InternalServerErrorException('Payment creation failed');
    }
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
