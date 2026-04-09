import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodProductRepository } from '../../datastore/superfoods/SuperfoodProduct.repo';
import { VariantRepository } from '../../datastore/Variant.repo';
import { ProductType } from '../../../domain/enums/ProductType';
import { SuperfoodSizeOptionAlternativeRepository } from '../../datastore/superfoods/SuperfoodSizeOptionAlternative.repo';
import { MediaUrlResolver } from '../../../infra/services/media/MediaUrlResolver';
import {
	BoxCatalogVariantItemDto,
	BoxCatalogVariantsResponseDto,
} from '../../models/box/catalog/BoxCatalogResponses';

@Injectable()
export class GetBoxCatalogSuperfoodVariantsUseCase {
	constructor(
		@Inject(SuperfoodProductRepository)
		private readonly superfoodProductRepository: SuperfoodProductRepository,
		@Inject(VariantRepository)
		private readonly variantRepository: VariantRepository,
		@Inject(SuperfoodSizeOptionAlternativeRepository)
		private readonly sizeOptionAlternativeRepository: SuperfoodSizeOptionAlternativeRepository,
		private readonly mediaUrlResolver: MediaUrlResolver,
	) {}

	async handle(productId: string): Promise<BoxCatalogVariantsResponseDto> {
		const product =
			await this.superfoodProductRepository.getSuperfoodProductById(productId);
		if (!product) {
			throw new NotFoundException('Superfood product not found');
		}

		const variants = await this.variantRepository.getByProductId(productId);
		const superfoodVariants = variants.filter(
			(v) => v.productType === ProductType.SUPERFOOD,
		);

		const sizeAlternativeIds = Array.from(
			new Set(
				superfoodVariants
					.map((v) => v.combination?.SIZE?.trim())
					.filter((id): id is string => Boolean(id)),
			),
		);
		const sizeAlternatives =
			await this.sizeOptionAlternativeRepository.getByIds(sizeAlternativeIds);
		const sizeLabelById = new Map(
			sizeAlternatives.map((option) => [option.id, option.nameLabel]),
		);

		const mainImgId = product.baseInfo?.productMedia?.mainImgId?.trim();
		const urlMap = await this.mediaUrlResolver.resolveUrls(
			mainImgId ? [mainImgId] : [],
		);
		const imgUrl = mainImgId ? (urlMap.get(mainImgId) ?? '') : '';

		const items: BoxCatalogVariantItemDto[] = superfoodVariants.map((v) => {
			const sizeId = v.combination?.SIZE;
			return {
				id: v.id,
				label:
					(sizeId ? sizeLabelById.get(sizeId) : undefined) ||
					(sizeId ? `Size ${sizeId}` : 'Superfood variant'),
				imgUrl,
				price: v.price,
				stock: v.stock,
				combination: { ...v.combination },
			};
		});

		return { items };
	}
}
