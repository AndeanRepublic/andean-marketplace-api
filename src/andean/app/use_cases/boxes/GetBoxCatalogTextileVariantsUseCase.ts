import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileProductRepository } from '../../datastore/textileProducts/TextileProduct.repo';
import { VariantRepository } from '../../datastore/Variant.repo';
import { MediaUrlResolver } from '../../../infra/services/media/MediaUrlResolver';
import { TextileVariantPickerMediaService } from '../../../infra/services/box/TextileVariantPickerMediaService';
import {
	BoxCatalogVariantItemDto,
	BoxCatalogVariantsResponseDto,
} from '../../models/box/catalog/BoxCatalogResponses';
import { ProductType } from '../../../domain/enums/ProductType';

@Injectable()
export class GetBoxCatalogTextileVariantsUseCase {
	constructor(
		@Inject(TextileProductRepository)
		private readonly textileProductRepository: TextileProductRepository,
		@Inject(VariantRepository)
		private readonly variantRepository: VariantRepository,
		private readonly mediaUrlResolver: MediaUrlResolver,
		private readonly textileVariantPickerMediaService: TextileVariantPickerMediaService,
	) {}

	async handle(productId: string): Promise<BoxCatalogVariantsResponseDto> {
		const product =
			await this.textileProductRepository.getTextileProductById(productId);
		if (!product) {
			throw new NotFoundException('Textile product not found');
		}

		const variants = await this.variantRepository.getByProductId(productId);
		const textileVariants = variants.filter(
			(v) => v.productType === ProductType.TEXTILE && v.stock > 0,
		);

		const mediaIds: string[] = [];
		const prepared = textileVariants.map((v) => {
			const mid =
				this.textileVariantPickerMediaService.resolveVariantMainMediaId(
					product,
					v,
				);
			if (mid) mediaIds.push(mid);
			return { variant: v, mediaId: mid };
		});

		const urlMap = await this.mediaUrlResolver.resolveUrls(mediaIds);

		const items: BoxCatalogVariantItemDto[] = prepared.map(
			({ variant: v, mediaId }) => ({
				id: v.id,
				label: this.textileVariantPickerMediaService.buildVariantLabel(v),
				imgUrl: mediaId ? (urlMap.get(mediaId) ?? '') : '',
				price: v.price,
				stock: v.stock,
				combination: { ...v.combination },
			}),
		);

		return { items };
	}
}
