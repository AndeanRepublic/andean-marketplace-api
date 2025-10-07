import { Body, Controller, Post } from '@nestjs/common';
import { CreateProductUseCase } from '../../app/use_cases/createProductUseCase';
import { CreateProductDto } from './dto/CreateProductDto';
import { Product } from '../../domain/entities/Product';

@Controller('products')
export class ProductController {
  constructor(private readonly createProductUseCase: CreateProductUseCase) {}

  @Post('')
  async createProduct(@Body() body: CreateProductDto): Promise<Product> {
    return this.createProductUseCase.handle(body);
  }
}
