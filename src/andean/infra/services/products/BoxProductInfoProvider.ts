import { Injectable, Inject } from '@nestjs/common';
import { ProductInfoProvider } from '../../../app/datastore/products/ProductInfoProvider';
import { ProductInfo } from '../../../app/models/shared/ProductInfo';
import { ProductType } from '../../../domain/enums/ProductType';
import { BoxRepository } from '../../../app/datastore/box/Box.repo';
import { MediaUrlResolver } from '../media/MediaUrlResolver';

/**
 * Provider de información de producto para Boxes.
 * Las cajas no tienen ownerType ni ownerId, se dejan vacíos.
 * isDiscountActive siempre es false para cajas.
 */
@Injectable()
export class BoxProductInfoProvider extends ProductInfoProvider {
	constructor(
		@Inject(BoxRepository)
		private readonly boxRepository: BoxRepository,
		private readonly mediaUrlResolver: MediaUrlResolver,
	) {
		super();
	}

	supports(productType: ProductType): boolean {
		return productType === ProductType.BOX;
	}

	async getProductInfo(productId: string): Promise<ProductInfo | null> {
		const box = await this.boxRepository.getById(productId);
		if (!box) return null;

		const thumbnailImgUrl = await this.mediaUrlResolver.resolveUrl(
			box.thumbnailImageId,
		);

		return {
			title: box.name,
			thumbnailImgUrl,
			ownerType: '',
			ownerId: '',
			isDiscountActive: false,
		};
	}

	async getProductInfoByIds(
		productIds: string[],
	): Promise<Map<string, ProductInfo>> {
		if (productIds.length === 0) {
			return new Map();
		}

		// Batch fetch boxes
		const boxes = await this.boxRepository.getByIdsInOrder(productIds);

		// Extraer thumbnailImageIds únicos para batch resolver
		const mediaIds = boxes
			.map((b) => b.thumbnailImageId)
			.filter((id): id is string => Boolean(id));

		const mediaUrlMap = await this.mediaUrlResolver.resolveUrls(mediaIds);

		// Mapear boxes a ProductInfo
		const result = new Map<string, ProductInfo>();
		for (const box of boxes) {
			const thumbnailImgUrl = box.thumbnailImageId
				? mediaUrlMap.get(box.thumbnailImageId) || ''
				: '';

			result.set(box.id, {
				title: box.name,
				thumbnailImgUrl,
				ownerType: '',
				ownerId: '',
				isDiscountActive: false,
			});
		}

		return result;
	}
}
