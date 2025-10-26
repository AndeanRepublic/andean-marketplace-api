import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateProductDto } from './dto/CreateProductDto';
import { Product } from '../../domain/entities/Product';
import { CreateProductUseCase } from '../../app/use_cases/products/CreateProductUseCase';
import { GetProductsBySellerIdUseCase } from '../../app/use_cases/products/GetProductsBySellerIdUseCase';
import { DeleteProductByIdUseCase } from '../../app/use_cases/products/DeleteProductByIdUseCase';
import { GetProductByIdUseCase } from '../../app/use_cases/products/GetProductByIdUseCase';

@Controller('products')
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getProductsBySellerIdUseCase: GetProductsBySellerIdUseCase,
    private readonly deleteProductByIdUseCase: DeleteProductByIdUseCase, 
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
  ) {}

  @Post('')
  async createProduct(@Body() body: CreateProductDto): Promise<Product> {
    return this.createProductUseCase.handle(body);
  }

  @Get('/by-seller/:sellerId')
  async findBySellerId(
    @Param('sellerId') sellerId: string,
  ): Promise<Product[]> {
    return this.getProductsBySellerIdUseCase.handle(sellerId);
  }

  @Get('/:productId')
  async findById(@Param('productId') productId: string): Promise<Product> {
    return this.getProductByIdUseCase.handle(productId);
  }

  @Delete('/:productId')
  async deleteProduct(@Param('productId') productId: string): Promise<void> {
    return this.deleteProductByIdUseCase.handle(productId);
  }
}
