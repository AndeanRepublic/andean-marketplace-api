import { Inject, Injectable } from '@nestjs/common';
import { TextileProductRepository } from '../../datastore/textileProducts/TextileProduct.repo';
import { MediaUrlResolver } from '../../../infra/services/media/MediaUrlResolver';
import {
	BoxCatalogTextileItemDto,
	BoxCatalogTextilesResponseDto,
} from '../../models/box/catalog/BoxCatalogResponses';

@Injectable()
export class GetBoxCatalogTextileProductsUseCase {
	constructor(
		@Inject(TextileProductRepository)
		private readonly textileProductRepository: TextileProductRepository,
		private readonly mediaUrlResolver: MediaUrlResolver,
	) {}

	async handle(): Promise<BoxCatalogTextilesResponseDto> {
		const rows = await this.textileProductRepository.getBoxCatalogAll();
		const mediaIds = rows
			.map((r) => r.imgId?.trim())
			.filter((id): id is string => Boolean(id));
		const urlMap = await this.mediaUrlResolver.resolveUrls(mediaIds);
		const items: BoxCatalogTextileItemDto[] = rows.map((r) => ({
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
