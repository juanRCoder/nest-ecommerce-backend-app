import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/products.dto';
import { UpdateUserDto } from 'src/users/dto/users.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProductsService {
  constructor (private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.product.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.product.findUnique({
      where: { id },
    })
  }

  async create(createProductDto: CreateProductDto) {
    return await this.prisma.product.create({
      data: {
        ...createProductDto,
      }
    })
  }

  async update(id: string, updateProductDto: UpdateUserDto) {
    return await this.prisma.product.update({
      where: { id },
      data: updateProductDto
    })
  }

  async remove(id: string) {
    return await this.prisma.product.delete({
		  where: { id }
	  })
  }
}
