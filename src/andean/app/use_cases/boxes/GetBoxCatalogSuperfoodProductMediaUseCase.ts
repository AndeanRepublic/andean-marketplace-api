import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodProductRepository } from '../../datastore/superfoods/SuperfoodProduct.repo';
import { MediaUrlResolver } from '../../../infra/services/media/MediaUrlResolver';
import { SuperfoodProductMedia } from '../../../domain/entities/superfoods/SuperfoodProductMedia';
import {
	BoxCatalogMediaItemDto,
	BoxCatalogMediaResponseDto,
} from '../../models/box/catalog/BoxCatalogResponses';

function collectSuperfoodMediaIds(
	media: SuperfoodProductMedia | undefined,
): string[] {
	if (!media) return [];
	const out: string[] = [];
	const add = (id?: string) => {
		const t = id?.trim();
		if (t) out.push(t);
	};
	add(media.mainImgId);
	add(media.plateImgId);
	add(media.sourceProductImgId);
	add(media.closestSourceProductImgId);
	for (const id of media.otherImagesId ?? []) add(id);
	return [...new Set(out)];
}

@Injectable()
export class GetBoxCatalogSuperfoodProductMediaUseCase {
	constructor(
		@Inject(SuperfoodProductRepository)
		private readonly superfoodProductRepository: SuperfoodProductRepository,
		private readonly mediaUrlResolver: MediaUrlResolver,
	) {}

	async handle(productId: string): Promise<BoxCatalogMediaResponseDto> {
		const product =
			await this.superfoodProductRepository.getSuperfoodProductById(productId);
		if (!product) {
			throw new NotFoundException(`Superfood product ${productId} not found`);
		}
		const uniqueIds = collectSuperfoodMediaIds(product.baseInfo?.productMedia);
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
