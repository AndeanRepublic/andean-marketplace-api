import { Inject, Injectable } from '@nestjs/common';

import { SuperfoodProductRepository } from '../../datastore/superfoods/SuperfoodProduct.repo';

import { MediaUrlResolver } from '../../../infra/services/media/MediaUrlResolver';

import {
	BoxCatalogSuperfoodItemDto,
	BoxCatalogSuperfoodsResponseDto,
} from '../../models/box/catalog/BoxCatalogResponses';

@Injectable()
export class GetBoxCatalogSuperfoodsUseCase {
	constructor(
		@Inject(SuperfoodProductRepository)
		private readonly superfoodProductRepository: SuperfoodProductRepository,
		private readonly mediaUrlResolver: MediaUrlResolver,
	) {}

	async handle(): Promise<BoxCatalogSuperfoodsResponseDto> {
		const rows =
			await this.superfoodProductRepository.getBoxCatalogAllIncludingZeroStock();
		const mediaIds = rows
			.map((r) => r.imgId?.trim())
			.filter((id): id is string => Boolean(id));

		const urlMap = await this.mediaUrlResolver.resolveUrls(mediaIds);
		const items: BoxCatalogSuperfoodItemDto[] = rows.map((r) => ({
			id: r.id,
			title: r.title,
			categoryName: r.categoryName || '',
			imgUrl: r.imgId ? (urlMap.get(r.imgId.trim()) ?? '') : '',
			catalogPrice: r.catalogPrice,
			totalStock: r.totalStock,
		}));

		return { items };
	}
}
