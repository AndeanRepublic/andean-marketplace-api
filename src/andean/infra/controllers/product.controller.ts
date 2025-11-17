import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateProductDto } from './dto/products/CreateProductDto';
import { Product } from '../../domain/entities/products/Product';
import { CreateProductUseCase } from '../../app/use_cases/products/CreateProductUseCase';
import { GetProductsBySellerIdUseCase } from '../../app/use_cases/products/GetProductsBySellerIdUseCase';
import { DeleteProductUseCase } from '../../app/use_cases/products/DeleteProductUseCase';
import { GetProductByIdUseCase } from '../../app/use_cases/products/GetProductByIdUseCase';
import { GetProductsByShopUseCase } from '../../app/use_cases/products/GetProductsByShopUseCase';
import { CreateVariantUseCase } from '../../app/use_cases/products/CreateVariantUseCase';
import { CreateVariantDto } from './dto/products/CreateVariantDto';
import { ProductVariant } from '../../domain/entities/products/ProductVariant';

@Controller('products')
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getProductsBySellerIdUseCase: GetProductsBySellerIdUseCase,
    private readonly getProductsByShopUseCase: GetProductsByShopUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
    private readonly deleteProductByIdUseCase: DeleteProductUseCase,
    private readonly createVariantUseCase: CreateVariantUseCase,
  ) {}

  @Post('')
  async createProduct(@Body() body: CreateProductDto): Promise<Product> {
    return this.createProductUseCase.handle(body);
  }

  @Post('/:productId/variants')
  async createVariant(
    @Param('productId') productId: string,
    @Body() body: CreateVariantDto,
  ): Promise<ProductVariant> {
    return this.createVariantUseCase.handle(body, productId);
  }

  @Get('/by-seller/:sellerId')
  async findBySellerId(
    @Param('sellerId') sellerId: string,
  ): Promise<Product[]> {
    return this.getProductsBySellerIdUseCase.handle(sellerId);
  }

  @Get('/by-shop/:shopId')
  async findByShop(@Param('shopId') shopId: string): Promise<Product[]> {
    return this.getProductsByShopUseCase.handle(shopId);
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
