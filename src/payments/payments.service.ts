import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payments.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  private paymentInclude = {
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
  };
  
  private formatPayment(payment) {
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
        name: payment.order.user.name,
      },
      products: payment.order.Order_Product.map(pr => ({
        name: pr.product.name,
        quantity: pr.quantity,
        price: pr.price,
        imgUrl: pr.product.imageUrl,
      })),
    };
  }

  async findAll() {
    try {
      const payments = await this.prisma.payment.findMany({
        include: this.paymentInclude,
      });
  
      return payments.map(this.formatPayment);
    } catch (error) {
      throw new InternalServerErrorException('Payment get all failed');
    }
  }

  async findOne(id: string) {
    try {
      const payment = await this.prisma.payment.findUnique({
        where: { id },
        include: this.paymentInclude,
      });
  
      return this.formatPayment(payment);
    } catch (error) {
      throw new InternalServerErrorException('Payment get for id failed');
    }
  }

  async create(createPaymentDto: CreatePaymentDto) {
    try {
      const payment = await this.prisma.$transaction(async (prisma) => {
        const createdPayment = await prisma.payment.create({
          data: { ...createPaymentDto },
        });
  
        const getVoucher = await prisma.payment.findUnique({
          where: { id: createdPayment.id },
          include: this.paymentInclude,
        });
  
        return this.formatPayment(getVoucher);
      });
  
      return { message: 'Payment created successfully', payment };
    } catch (error) {
      throw new InternalServerErrorException('Payment creation failed');
    }
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    try {
      const updatedPayment = await this.prisma.payment.update({
        where: { id },
        data: updatePaymentDto
      })

      return { message: 'Payment updated successfully', updatedPayment}

    } catch(error) {
      throw new InternalServerErrorException('Payment update failed')
    }
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
