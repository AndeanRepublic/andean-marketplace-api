import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../datastore/product.repo';

@Injectable()
export class DeleteProductByIdUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async handle(productId: string): Promise<void> {
    return this.productRepository.deleteProduct(productId);
  }
}
