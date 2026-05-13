import { Injectable, Inject } from '@nestjs/common';
import { ProductInfoProvider } from '../../../app/datastore/products/ProductInfoProvider';
import { ProductInfo } from '../../../app/models/shared/ProductInfo';
import { ProductType } from '../../../domain/enums/ProductType';
import { SuperfoodProductRepository } from '../../../app/datastore/superfoods/SuperfoodProduct.repo';
import { MediaUrlResolver } from '../media/MediaUrlResolver';

@Injectable()
export class SuperfoodProductInfoProvider extends ProductInfoProvider {
	constructor(
		@Inject(SuperfoodProductRepository)
		private readonly superfoodProductRepository: SuperfoodProductRepository,
		private readonly mediaUrlResolver: MediaUrlResolver,
	) {
		super();
	}

	supports(productType: ProductType): boolean {
		return productType === ProductType.SUPERFOOD;
	}

	async getProductInfo(productId: string): Promise<ProductInfo | null> {
		const product =
			await this.superfoodProductRepository.getSuperfoodProductById(productId);

		if (!product) {
			return null;
		}

		const thumbnailImgUrl = await this.mediaUrlResolver.resolveUrl(
			product.baseInfo.productMedia?.mainImgId || '',
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
		const products = await this.superfoodProductRepository.getByIds(productIds);

		// Extraer mediaIds únicos para batch resolver
		const mediaIds = products
			.map((p) => p.baseInfo.productMedia?.mainImgId)
			.filter((id): id is string => Boolean(id));

		const mediaUrlMap = await this.mediaUrlResolver.resolveUrls(mediaIds);

		// Mapear productos a ProductInfo
		const result = new Map<string, ProductInfo>();
		for (const product of products) {
			const mainImgId = product.baseInfo.productMedia?.mainImgId;
			const thumbnailImgUrl = mainImgId
				? mediaUrlMap.get(mainImgId) || ''
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
