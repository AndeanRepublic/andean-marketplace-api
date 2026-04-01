import { Inject, Injectable } from '@nestjs/common';
import {
	TextileProductRepository,
	ProductFilters,
} from '../../datastore/textileProducts/TextileProduct.repo';
import { MediaUrlResolver } from '../../../infra/services/media/MediaUrlResolver';
import { PaginatedProductsResponse } from '../../models/shared/PaginatedProductsResponse';
import { TextileProductListItem } from '../../models/textile/TextileProductListItemResponse';

@Injectable()
export class GetAllTextileProductsUseCase {
	constructor(
		@Inject(TextileProductRepository)
		private readonly textileProductRepository: TextileProductRepository,
		private readonly mediaUrlResolver: MediaUrlResolver,
	) {}

	async handle(
		filters?: ProductFilters,
	): Promise<PaginatedProductsResponse<TextileProductListItem>> {
		// Si no hay filtros, usar método legacy con formato
		if (!filters || Object.keys(filters).length === 0) {
			const defaultFilters = { page: 1, perPage: 10 };
			const [{ products, total }, filterCount] = await Promise.all([
				this.textileProductRepository.getAllWithFilters(defaultFilters),
				this.textileProductRepository.getFilterCounts(),
			]);

			const enrichedProducts = await this.enrichPrincipalImgUrls(products);

			return {
				products: enrichedProducts,
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

		const page = filters.page || 1;
		const perPage = filters.perPage || 10;

		const enrichedProducts = await this.enrichPrincipalImgUrls(products);

		return {
			products: enrichedProducts,
			pagination: {
				total,
				page,
				per_page: perPage,
			},
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
