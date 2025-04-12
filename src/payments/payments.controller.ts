import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payments.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.paymentsService.remove(+id);
  // }
}
