import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../../datastore/Product.repo';
import { Product } from '../../../domain/entities/products/Product';

@Injectable()
export class GetProductByIdUseCase {
	constructor(private readonly productRepository: ProductRepository) {}

	async handle(productId: string): Promise<Product> {
		const productFound = await this.productRepository.getProductById(productId);
		if (!productFound) {
			throw new NotFoundException('Product not found');
		}
		return productFound;
	}
}
