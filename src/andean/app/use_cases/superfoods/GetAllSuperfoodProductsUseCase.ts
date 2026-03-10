import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
	SuperfoodProductFilters,
	SuperfoodProductRepository,
} from '../../datastore/superfoods/SuperfoodProduct.repo';
import { PaginatedProductsResponse } from '../../modules/shared/PaginatedProductsResponse';
import { SuperfoodProductListItem } from '../../models/superfoods/SuperfoodProductListItem';

@Injectable()
export class GetAllSuperfoodProductsUseCase {
	constructor(
		@Inject(SuperfoodProductRepository)
		private readonly superfoodProductRepository: SuperfoodProductRepository,
	) {}

	async handle(
		filters?: SuperfoodProductFilters,
	): Promise<PaginatedProductsResponse<SuperfoodProductListItem>> {
		// Si no hay filtros, usar valores por defecto
		if (!filters || Object.keys(filters).length === 0) {
			const defaultFilters = { page: 1, perPage: 10 };
			const { products, total } =
				await this.superfoodProductRepository.getAllWithFilters(defaultFilters);

			if (products.length === 0) {
				throw new NotFoundException('No superfood products found');
			}

			return {
				products,
				pagination: {
					total,
					page: 1,
					per_page: 10,
				},
			};
		}

		// Con filtros (incluye paginación, precios, categoryId, ownerId, sortBy)
		const { products, total } =
			await this.superfoodProductRepository.getAllWithFilters(filters);

		if (products.length === 0) {
			throw new NotFoundException(
				'No superfood products found with the specified filters',
			);
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
