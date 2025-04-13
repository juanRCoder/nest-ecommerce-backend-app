import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/products.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { TokenGuard } from 'src/guards/token.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('category') category?: string,
  ) {
    return this.productsService.findAllProducts(Number(page), Number(limit), category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOneProduct(id);
  }

  @UseGuards(TokenGuard, RoleGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @UseGuards(TokenGuard, RoleGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.updateProduct(id, updateProductDto);
  }
  @Patch()
  handleMissingIdForUpdate() {
    throw new NotFoundException('ID must be provided for update');
  }

  @UseGuards(TokenGuard, RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.removeProduct(id);
  }
  @Delete()
  handleMissingIdForDelete() {
    throw new NotFoundException('ID must be provided for delete');
  }
}
