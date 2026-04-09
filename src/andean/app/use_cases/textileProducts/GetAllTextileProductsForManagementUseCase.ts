import { Inject, Injectable } from '@nestjs/common';
import { TextileProductRepository } from '../../datastore/textileProducts/TextileProduct.repo';
import { MediaUrlResolver } from '../../../infra/services/media/MediaUrlResolver';
import { PaginatedProductsResponse } from '../../models/shared/PaginatedProductsResponse';
import { TextileProductListItem } from '../../models/textile/TextileProductListItemResponse';
import { ProductSortBy } from '../../../domain/enums/ProductSortBy';

@Injectable()
export class GetAllTextileProductsForManagementUseCase {
	constructor(
		@Inject(TextileProductRepository)
		private readonly textileProductRepository: TextileProductRepository,
		private readonly mediaUrlResolver: MediaUrlResolver,
	) {}

	async handle(
		page: number = 1,
		perPage: number = 10,
	): Promise<PaginatedProductsResponse<TextileProductListItem>> {
		const filters = {
			page,
			perPage,
			includeZeroStock: true,
			sortBy: ProductSortBy.LATEST,
		};

		const [{ products, total }, filterCount] = await Promise.all([
			this.textileProductRepository.getAllWithFilters(filters),
			this.textileProductRepository.getFilterCounts(filters),
		]);

		const enrichedProducts = await this.enrichPrincipalImgUrls(products);

		return {
			products: enrichedProducts,
			pagination: { total, page, per_page: perPage },
			filterCount,
		};
	}

	private async enrichPrincipalImgUrls(
		products: TextileProductListItem[],
	): Promise<TextileProductListItem[]> {
		const mediaIds = products
			.map((p) => p.principalImgUrl)
			.filter((id): id is string => Boolean(id));
		const mediaIdToUrl = await this.mediaUrlResolver.resolveUrls(mediaIds);

		return products.map((p) => ({
			...p,
			principalImgUrl: p.principalImgUrl
				? (mediaIdToUrl.get(p.principalImgUrl) ?? '')
				: '',
			stock: p.stock ?? 0,
		}));
	}
}
