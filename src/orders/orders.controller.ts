import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto } from './dto/orders.dto';
import { TokenGuard } from 'src/guards/token.guard';
import { RoleGuard } from 'src/guards/role.guard';

@UseGuards(TokenGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(RoleGuard)
  @Get()
  findAll() {
    return this.ordersService.findAllOrders();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOneOrder(id);
  }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @UseGuards(RoleGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.updateOrder(id, updateOrderDto);
  }
  @UseGuards(RoleGuard)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.updateStatusOrder(id, updateOrderDto)
  }
  @Patch()
  handleMissingIdForUpdate() {
    throw new NotFoundException('ID must be provided for update');
  }

  @UseGuards(RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.removeOrder(id);
  }
  @Delete()
  handleMissingIdForDelete() {
    throw new NotFoundException('ID must be provided for delete');
  }
}
