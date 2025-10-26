import { Inject, Injectable } from '@nestjs/common';
import { ProductRepository } from '../../datastore/product.repo';
import { CreateProductDto } from '../../../infra/controllers/dto/CreateProductDto';
import { Product } from '../../../domain/entities/Product';
import { ProductStatus } from '../../../domain/enums/ProductStatus';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(ProductRepository)
    private readonly productRepository: ProductRepository,
  ) {}

  async handle(productDto: CreateProductDto): Promise<Product> {
    const productToSave = new Product(
      crypto.randomUUID(),
      productDto.shopId,
      productDto.sellerId,
      productDto.name,
      productDto.description,
      productDto.price,
      productDto.stock,
      productDto.category,
      ProductStatus.ACTIVE,
    );
    return this.productRepository.saveProduct(productToSave);
  }
}
