import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileProductRepository } from '../../datastore/textileProducts/TextileProduct.repo';
import { MediaUrlResolver } from '../../../infra/services/media/MediaUrlResolver';
import {
	BoxCatalogMediaItemDto,
	BoxCatalogMediaResponseDto,
} from '../../models/box/catalog/BoxCatalogResponses';

@Injectable()
export class GetBoxCatalogTextileProductMediaUseCase {
	constructor(
		@Inject(TextileProductRepository)
		private readonly textileProductRepository: TextileProductRepository,
		private readonly mediaUrlResolver: MediaUrlResolver,
	) {}

	async handle(productId: string): Promise<BoxCatalogMediaResponseDto> {
		const product =
			await this.textileProductRepository.getTextileProductById(productId);
		if (!product) {
			throw new NotFoundException(`Textile product ${productId} not found`);
		}
		const rawIds = product.baseInfo?.mediaIds ?? [];
		const uniqueIds = [
			...new Set(
				rawIds
					.map((id) => (typeof id === 'string' ? id.trim() : ''))
					.filter(Boolean),
			),
		];
		if (uniqueIds.length === 0) {
			return { items: [] };
		}
		const urlMap = await this.mediaUrlResolver.resolveUrls(uniqueIds);
		const items: BoxCatalogMediaItemDto[] = uniqueIds.map((id) => ({
			id,
			url: urlMap.get(id) ?? '',
		}));
		return { items };
	}
}
