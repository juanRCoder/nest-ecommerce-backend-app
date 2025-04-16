import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payments.dto';
import { TokenGuard } from 'src/guards/token.guard';
import { RoleGuard } from 'src/guards/role.guard';

@UseGuards(TokenGuard, RoleGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  findAll() {
    return this.paymentsService.findAllPayments();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOnePayment(id);
  }

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.createPayment(createPaymentDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.updatePayment(id, updatePaymentDto);
  }
  @Patch('/:id/confirm')
  confirmPayment(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.confirmPayment(id, updatePaymentDto)
  }
  handleMissingIdForUpdate() {
    throw new NotFoundException('ID must be provided for update');
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentsService.removePayment(id);
  }
  @Delete()
  handleMissingIdForDelete() {
    throw new NotFoundException('ID must be provided for delete');
  }
}
