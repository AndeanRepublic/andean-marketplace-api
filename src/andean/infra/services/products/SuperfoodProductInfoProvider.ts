import { Injectable, Inject } from '@nestjs/common';
import { ProductInfoProvider } from '../../../app/datastore/products/ProductInfoProvider';
import { ProductInfo } from '../../../domain/interfaces/ProductInfo';
import { ProductType } from '../../../domain/enums/ProductType';
import { SuperfoodProductRepository } from '../../../app/datastore/superfoods/SuperfoodProduct.repo';

@Injectable()
export class SuperfoodProductInfoProvider extends ProductInfoProvider {
	constructor(
		@Inject(SuperfoodProductRepository)
		private readonly superfoodProductRepository: SuperfoodProductRepository,
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

		return {
			title: product.baseInfo.title,
			thumbnailImgUrl: product.baseInfo.mediaIds[0] || '',
			ownerType: product.baseInfo.ownerType,
			ownerId: product.baseInfo.ownerId,
			isDiscountActive: product.isDiscountActive,
		};
	}
}
