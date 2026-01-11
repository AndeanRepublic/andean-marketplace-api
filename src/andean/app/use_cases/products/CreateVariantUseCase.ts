import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductVariantRepository } from '../../datastore/ProductVariant.repo';
import { ProductRepository } from '../../datastore/Product.repo';
import { CreateVariantDto } from '../../../infra/controllers/dto/products/CreateVariantDto';
import { ProductVariant } from '../../../domain/entities/products/ProductVariant';
import { ProductVariantMapper } from '../../../infra/services/ProductVariantMapper';

@Injectable()
export class CreateVariantUseCase {
  constructor(
    @Inject(ProductVariantRepository)
    private readonly productVariantRepository: ProductVariantRepository,
    @Inject(ProductRepository)
    private readonly productRepository: ProductRepository,
  ) {}

  async handle(
    dto: CreateVariantDto,
    productId: string,
  ): Promise<ProductVariant> {
    const productFound = await this.productRepository.getProductById(productId);
    if (!productFound) {
      throw new NotFoundException('Product not found');
    }
    const variant = ProductVariantMapper.fromCreateDto(dto, productId);
    return this.productVariantRepository.saveProductVariant(variant);
  }
}
