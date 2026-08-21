import { Inject, Injectable } from '@nestjs/common';
import { TextileProductRepository } from '../../datastore/textileProducts/TextileProduct.repo';
import { MediaUrlResolver } from '../../../infra/services/media/MediaUrlResolver';
import { PaginatedProductsResponse } from '../../models/shared/PaginatedProductsResponse';
import { TextileProductListItem } from '../../models/textile/TextileProductListItemResponse';
import { ProductSortBy } from '../../../domain/enums/ProductSortBy';
import { AccountRole } from '../../../domain/enums/AccountRole';
import { SellerResourceAccessService } from '../../../infra/services/seller/SellerResourceAccessService';

@Injectable()
export class GetAllTextileProductsForManagementUseCase {
	constructor(
		@Inject(TextileProductRepository)
		private readonly textileProductRepository: TextileProductRepository,
		private readonly mediaUrlResolver: MediaUrlResolver,
		private readonly sellerResourceAccess: SellerResourceAccessService,
	) {}

	async handle(
		page: number = 1,
		perPage: number = 10,
		requestingUserId: string,
		roles: AccountRole[],
	): Promise<PaginatedProductsResponse<TextileProductListItem>> {
		const ownerIds = await this.sellerResourceAccess.resolveManagementOwnerIds(
			requestingUserId,
			roles,
		);
		if (ownerIds && ownerIds.length === 0) {
			return {
				products: [],
				pagination: { total: 0, page, per_page: perPage },
			};
		}

		const filters = {
			page,
			perPage,
			includeZeroStock: true,
			includeAllStatuses: true,
			sortBy: ProductSortBy.LATEST,
			...(ownerIds ? { ownerIds } : {}),
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
