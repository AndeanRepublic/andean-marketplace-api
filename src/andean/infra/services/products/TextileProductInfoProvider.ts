import { Injectable, Inject } from '@nestjs/common';
import { ProductInfoProvider } from '../../../app/datastore/products/ProductInfoProvider';
import { ProductInfo } from '../../../app/models/shared/ProductInfo';
import { ProductType } from '../../../domain/enums/ProductType';
import { TextileProductRepository } from '../../../app/datastore/textileProducts/TextileProduct.repo';

@Injectable()
export class TextileProductInfoProvider extends ProductInfoProvider {
	constructor(
		@Inject(TextileProductRepository)
		private readonly textileProductRepository: TextileProductRepository,
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

		return {
			title: product.baseInfo.title,
			thumbnailImgUrl: product.baseInfo.mediaIds[0] || '',
			ownerType: product.baseInfo.ownerType,
			ownerId: product.baseInfo.ownerId,
			isDiscountActive: product.isDiscountActive,
		};
	}
}
