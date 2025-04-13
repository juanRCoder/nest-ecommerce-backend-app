import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/products.dto';
import { UpdateUserDto } from 'src/users/dto/users.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAllProducts(page?: number, limit?: number, category?: string) {
    const categories = category ? category.split(',') : undefined;
    const whereCondition = categories
      ? { category: { hasSome: categories } }
      : {};

    try {
      if (!page || !limit) {
        const products = await this.prisma.product.findMany({
          where: whereCondition,
        });
        return products.map(({ createAt, updateAt, ...rest }) => rest) || [];
      }
      const offset = (page - 1) * limit;
      const [products, total] = await Promise.all([
        this.prisma.product.findMany({
          where: whereCondition,
          skip: offset,
          take: limit,
        }),
        this.prisma.product.count({
          where: whereCondition,
        }),
      ]);
      return {
        pagination: {
          products: total,
          limit,
          offset,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
        },
        products: products.map(({ createAt, updateAt, ...rest }) => rest) || [],
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error finding the all products',
        error,
      );
    }
  }

  async findOneProduct(id: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        throw new NotFoundException(
          `Product with ID ${id} not found or has been deleted`,
        );
      }

      const {createAt, updateAt, ...oneProduct} = product
      return oneProduct;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Error finding the product',
        error,
      );
    }
  }

  async createProduct(createProductDto: CreateProductDto) {
    try {
      await this.prisma.product.create({
        data: {
          ...createProductDto,
        },
      });

      return { message: 'created product successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create a product',
        error,
      );
    }
  }

  async updateProduct(id: string, updateProductDto: UpdateUserDto) {
    try {
      const existingProduct = await this.prisma.product.findUnique({
        where: { id },
      });
    
      if (!existingProduct) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });

      return { message: 'updated product successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Failed to update a product',
        error,
      );
    }
  }

  async removeProduct(id: string) {
    try {
      await this.prisma.product.delete({
        where: { id },
      });

      return { message: 'removed product successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to remove a product',
        error,
      );
    }
  }
}
