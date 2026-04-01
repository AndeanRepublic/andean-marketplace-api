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
}
