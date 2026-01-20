import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileProductRepository, ProductFilters } from '../../datastore/textileProducts/TextileProduct.repo';
import { TextileProduct } from 'src/andean/domain/entities/textileProducts/TextileProduct';
import { PaginatedProductsResponse } from '../../modules/PaginatedProductsResponse';

@Injectable()
export class GetAllTextileProductsUseCase {
	constructor(
		@Inject(TextileProductRepository)
		private readonly textileProductRepository: TextileProductRepository,
	) { }

	async handle(filters?: ProductFilters): Promise<PaginatedProductsResponse<TextileProduct>> {
		// Si no hay filtros, usar método legacy
		if (!filters || Object.keys(filters).length === 0) {
			const products = await this.textileProductRepository.getAllTextileProducts();
			if (products.length === 0) {
				throw new NotFoundException('No textile products found');
			}

			const total = products.length;
			return {
				products,
				pagination: {
					total,
					page: 1,
					per_page: total,
				},
			};
		}

		// Con filtros (incluye paginación, color, size, precios, categoryId, ownerId)
		const { products, total } = await this.textileProductRepository.getAllWithFilters(filters);

		if (products.length === 0) {
			throw new NotFoundException('No textile products found with the specified filters');
		}

		const page = filters.page || 1;
		const perPage = filters.perPage || 10;

		return {
			products,
			pagination: {
				total,
				page,
				per_page: perPage,
			},
		};
	}
}
