import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileProductRepository, ProductFilters } from '../../datastore/textileProducts/TextileProduct.repo';
import { PaginatedProductsResponse } from '../../modules/PaginatedProductsResponse';
import { TextileProductListItem } from '../../modules/TextileProductListItemResponse';

@Injectable()
export class GetAllTextileProductsUseCase {
	constructor(
		@Inject(TextileProductRepository)
		private readonly textileProductRepository: TextileProductRepository,
	) { }

	async handle(filters?: ProductFilters): Promise<PaginatedProductsResponse<TextileProductListItem>> {
		// Si no hay filtros, usar método legacy con formato
		if (!filters || Object.keys(filters).length === 0) {
			const defaultFilters = { page: 1, perPage: 10 };
			const [{ products, total }, filterCount] = await Promise.all([
				this.textileProductRepository.getAllWithFilters(defaultFilters),
				this.textileProductRepository.getFilterCounts(),
			]);

			if (products.length === 0) {
				throw new NotFoundException('No textile products found');
			}

			return {
				products,
				pagination: {
					total,
					page: 1,
					per_page: 10,
				},
				filterCount,
			};
		}

		// Con filtros (incluye paginación, color, size, precios, categoryId, ownerId)
		const [{ products, total }, filterCount] = await Promise.all([
			this.textileProductRepository.getAllWithFilters(filters),
			this.textileProductRepository.getFilterCounts(filters),
		]);

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
			filterCount,
		};
	}
}
