import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../datastore/Product.repo';

@Injectable()
export class DeleteProductUseCase {
	constructor(private readonly productRepository: ProductRepository) {}

	async handle(productId: string): Promise<void> {
		return this.productRepository.deleteProduct(productId);
	}
}
