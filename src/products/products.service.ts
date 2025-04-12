import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/products.dto';
import { UpdateUserDto } from 'src/users/dto/users.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page?: number, limit?: number, category?: string) {
    
    const categories = category ? category.split(',') : undefined;

    const whereCondition = categories
      ? { category: { hasSome: categories } }
      : {};

    if (!page || !limit) {
      const products = await this.prisma.product.findMany({
        where: whereCondition
      });
      return products;
    }
    const offset = (page - 1) * limit;
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: whereCondition,
        skip: offset,
        take: limit,
      }),
      this.prisma.product.count({
        where: whereCondition
      }),
    ]);
    return {
      pagination: {
        products: total,
        limit,
        offset,
        currentPage: page,
        totalPages: Math.ceil(total / limit)
      },
      products,
    };
  }

  async findOne(id: string) {
    return await this.prisma.product.findUnique({
      where: { id },
    });
  }

  async create(createProductDto: CreateProductDto) {
    return await this.prisma.product.create({
      data: {
        ...createProductDto,
      },
    });
  }

  async update(id: string, updateProductDto: UpdateUserDto) {
    return await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.product.delete({
      where: { id },
    });
  }
}
