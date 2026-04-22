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
}
