import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../../datastore/Product.repo';
import { CreateProductDto } from '../../../infra/controllers/dto/products/CreateProductDto';
import { Product } from '../../../domain/entities/products/Product';
import { ShopRepository } from '../../datastore/Shop.repo';
import { ProductMapper } from '../../../infra/services/ProductMapper';

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
		const productToSave = ProductMapper.fromCreateDto(
			productDto,
			shopFound.sellerId,
		);
		return this.productRepository.saveProduct(productToSave);
	}
}
