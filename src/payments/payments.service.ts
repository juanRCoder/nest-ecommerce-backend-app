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
      const createOrder = this.prisma.payment.create({
        data: createPaymentDto,
      });

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
