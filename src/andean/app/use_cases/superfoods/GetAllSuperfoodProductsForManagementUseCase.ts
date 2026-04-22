import { Inject, Injectable } from '@nestjs/common';
import { SuperfoodProductRepository } from '../../datastore/superfoods/SuperfoodProduct.repo';
import { PaginatedProductsResponse } from '../../models/shared/PaginatedProductsResponse';
import { SuperfoodProductListItem } from '../../models/superfoods/SuperfoodProductListItem';
import { SuperfoodProductListColorResolver } from '../../../infra/services/superfood/SuperfoodProductListColorResolver';
import { SuperfoodProductListMediaResolver } from '../../../infra/services/superfood/SuperfoodProductListMediaResolver';

@Injectable()
export class GetAllSuperfoodProductsForManagementUseCase {
	constructor(
		@Inject(SuperfoodProductRepository)
		private readonly superfoodProductRepository: SuperfoodProductRepository,
		private readonly superfoodProductListColorResolver: SuperfoodProductListColorResolver,
		private readonly superfoodProductListMediaResolver: SuperfoodProductListMediaResolver,
	) {}

	async handle(
		page: number = 1,
		perPage: number = 10,
	): Promise<PaginatedProductsResponse<SuperfoodProductListItem>> {
		const { products, total } =
			await this.superfoodProductRepository.getAllWithFilters({
				page,
				perPage,
				includeZeroStock: true,
			});

		if (products.length === 0) {
			return {
				products: [],
				pagination: { total, page, per_page: perPage },
			};
		}

		const withMedia =
			await this.superfoodProductListMediaResolver.attachListMediaFromAggregate(
				products,
			);
		const withColors =
			await this.superfoodProductListColorResolver.attachCatalogColorFromAggregate(
				withMedia,
			);

		return {
			products: withColors,
			pagination: { total, page, per_page: perPage },
		};
	}
}
