import { Injectable, Inject } from '@nestjs/common';
import { ProductInfoProvider } from '../../../app/datastore/products/ProductInfoProvider';
import { ProductInfo } from '../../../app/models/shared/ProductInfo';
import { ProductType } from '../../../domain/enums/ProductType';
import { TextileProductRepository } from '../../../app/datastore/textileProducts/TextileProduct.repo';
import { MediaUrlResolver } from '../media/MediaUrlResolver';

@Injectable()
export class TextileProductInfoProvider extends ProductInfoProvider {
	constructor(
		@Inject(TextileProductRepository)
		private readonly textileProductRepository: TextileProductRepository,
		private readonly mediaUrlResolver: MediaUrlResolver,
	) {
		super();
	}

	supports(productType: ProductType): boolean {
		return productType === ProductType.TEXTILE;
	}

	async getProductInfo(productId: string): Promise<ProductInfo | null> {
		const product =
			await this.textileProductRepository.getTextileProductById(productId);

		if (!product) {
			return null;
		}

		const thumbnailImgUrl = await this.mediaUrlResolver.resolveUrl(
			product.baseInfo.mediaIds[0] || '',
		);

		return {
			title: product.baseInfo.title,
			thumbnailImgUrl,
			ownerType: product.baseInfo.ownerType,
			ownerId: product.baseInfo.ownerId,
			isDiscountActive: product.isDiscountActive,
		};
	}

	async getProductInfoByIds(
		productIds: string[],
	): Promise<Map<string, ProductInfo>> {
		if (productIds.length === 0) {
			return new Map();
		}

		// Batch fetch productos
		const products = await this.textileProductRepository.getByIds(productIds);

		// Extraer mediaIds únicos para batch resolver
		const mediaIds = products
			.map((p) => p.baseInfo.mediaIds[0])
			.filter((id): id is string => Boolean(id));

		const mediaUrlMap = await this.mediaUrlResolver.resolveUrls(mediaIds);

		// Mapear productos a ProductInfo
		const result = new Map<string, ProductInfo>();
		for (const product of products) {
			const primaryMediaId = product.baseInfo.mediaIds[0];
			const thumbnailImgUrl = primaryMediaId
				? mediaUrlMap.get(primaryMediaId) || ''
				: '';

			result.set(product.id, {
				title: product.baseInfo.title,
				thumbnailImgUrl,
				ownerType: product.baseInfo.ownerType,
				ownerId: product.baseInfo.ownerId,
				isDiscountActive: product.isDiscountActive,
			});
		}

		return result;
	}
}
