import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../../datastore/Product.repo';
import { CreateProductDto } from '../../../infra/controllers/dto/CreateProductDto';
import { Product } from '../../../domain/entities/Product';
import { ProductStatus } from '../../../domain/enums/ProductStatus';
import { ShopRepository } from '../../datastore/Shop.repo';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(ShopRepository)
    private shopRepository: ShopRepository,
    @Inject(ProductRepository)
    private readonly productRepository: ProductRepository,
  ) {}

  async handle(productDto: CreateProductDto): Promise<Product> {
    const shopFound = await this.shopRepository.getById(productDto.shopId);
    if (!shopFound) {
      throw new NotFoundException('Shop not found');
    }
    const productToSave = new Product(
      crypto.randomUUID(),
      productDto.shopId,
      shopFound.sellerId,
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
