import { Injectable, Inject } from '@nestjs/common';
import { ProductInfoProvider } from '../../../app/datastore/products/ProductInfoProvider';
import { ProductInfo } from '../../../app/models/shared/ProductInfo';
import { ProductType } from '../../../domain/enums/ProductType';
import { BoxRepository } from '../../../app/datastore/box/Box.repo';

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
	) {
		super();
	}

	supports(productType: ProductType): boolean {
		return productType === ProductType.BOX;
	}

	async getProductInfo(productId: string): Promise<ProductInfo | null> {
		const box = await this.boxRepository.getById(productId);
		if (!box) return null;

		return {
			title: box.title,
			thumbnailImgUrl: box.thumbnailImageId,
			ownerType: '',
			ownerId: '',
			isDiscountActive: false,
		};
	}
}
