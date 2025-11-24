import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../../datastore/Product.repo';
import { Product } from '../../../domain/entities/products/Product';
import { SellerProfileRepository } from '../../datastore/Seller.repo';

@Injectable()
export class GetProductsBySellerIdUseCase {
  constructor(
    @Inject(ProductRepository)
    private readonly productRepository: ProductRepository,
    @Inject(SellerProfileRepository)
    private readonly sellerRepository: SellerProfileRepository,
  ) {}

  async handle(sellerId: string): Promise<Product[]> {
    const sellerFound = await this.sellerRepository.getSellerById(sellerId);
    if (!sellerFound) {
      throw new NotFoundException();
    }
    return this.productRepository.getAllBySellerId(sellerId);
  }
}
