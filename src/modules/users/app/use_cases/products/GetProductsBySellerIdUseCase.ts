import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../../datastore/Product.repo';
import { Product } from '../../../domain/entities/Product';
import { SellerRepository } from '../../datastore/Seller.repo';

@Injectable()
export class GetProductsBySellerIdUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly sellerRepository: SellerRepository,
  ) {}

  async handle(sellerId: string): Promise<Product[]> {
    const sellerFound = await this.sellerRepository.getSellerById(sellerId);
    if (!sellerFound) {
      throw new NotFoundException();
    }
    return this.productRepository.getAllBySellerId(sellerId);
  }
}
