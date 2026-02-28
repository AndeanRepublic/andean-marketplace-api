import { Injectable, NotFoundException } from '@nestjs/common';
import { BoxRepository } from '../../datastore/box/Box.repo';
import { BoxSealRepository } from '../../datastore/box/BoxSeal.repo';
import {
	BoxDetailResponse,
	BoxContainedProductResponse,
	BoxSealDetailResponse,
} from '../../models/box/BoxDetailResponse';
import { BoxImageResponse } from '../../models/box/BoxImageResponse';
import { ProductType } from '../../../domain/enums/ProductType';
import { BoxProductResolutionService } from '../../../infra/services/box/BoxProductResolutionService';

@Injectable()
export class GetBoxDetailUseCase {
	constructor(
		private readonly boxRepository: BoxRepository,
		private readonly boxSealRepository: BoxSealRepository,
		private readonly boxResolutionService: BoxProductResolutionService,
	) {}

	async handle(boxId: string): Promise<BoxDetailResponse> {
		const box = await this.boxRepository.getById(boxId);
		if (!box) {
			throw new NotFoundException('Box not found');
		}

		// Bulk fetch all dependencies + seals in optimized parallel queries
		const [dependencies, seals] = await Promise.all([
			this.boxResolutionService.bulkFetchBoxDependencies([box]),
			this.boxSealRepository.getByIds(box.sealIds),
		]);

		// Assemble hero section
		const heroDetail = {
			title: box.title,
			subtitle: box.subtitle,
			thumbnailImage: this.boxResolutionService.resolveImage(
				box.thumbnailImageId,
				dependencies.mediaMap,
			),
			mainImage: this.boxResolutionService.resolveImage(
				box.mainImageId,
				dependencies.mediaMap,
			),
		};

		// Assemble detail section
		const thumbMedia = dependencies.mediaMap.get(box.thumbnailImageId);
		const mainMedia = dependencies.mediaMap.get(box.mainImageId);
		const detail = {
			description: box.description,
			images: [
				mainMedia ? { url: mainMedia.key, name: mainMedia.name } : null,
				thumbMedia ? { url: thumbMedia.key, name: thumbMedia.name } : null,
			].filter((img): img is BoxImageResponse => img !== null),
		};

		// Assemble contained products
		let discartedPrice = 0;
		const containedProducts: BoxContainedProductResponse[] = [];

		for (const product of box.products) {
			if (product.productId) {
				const superfood = dependencies.superfoodMap.get(product.productId);
				if (superfood) {
					const price = this.boxResolutionService.getSuperfoodPrice(superfood);
					discartedPrice += price;

					containedProducts.push({
						id: product.productId,
						title: superfood.baseInfo?.title || '',
						thumbnailImage: this.boxResolutionService.resolveImage(
							superfood.baseInfo?.mediaIds?.[0],
							dependencies.mediaMap,
						),
						information: superfood.baseInfo?.description || '',
						type: ProductType.SUPERFOOD,
						discartedPrice: price,
						price,
					});
				}
			} else if (product.variantId) {
				const variant = dependencies.variantMap.get(product.variantId);
				if (variant) {
					const price = this.boxResolutionService.getVariantPrice(variant);
					discartedPrice += price;
					const textile = dependencies.textileMap.get(variant.productId);

					containedProducts.push({
						id: product.variantId,
						title: textile?.baseInfo?.title || '',
						thumbnailImage: this.boxResolutionService.resolveImage(
							textile?.baseInfo?.mediaIds?.[0],
							dependencies.mediaMap,
						),
						information: textile?.baseInfo?.description || '',
						type: ProductType.TEXTILE,
						discartedPrice: price,
						price,
					});
				}
			}
		}

		// Assemble price detail
		const discountPorcentage =
			discartedPrice > 0
				? Math.round((1 - box.price / discartedPrice) * 100)
				: 0;

		// Assemble box seals
		const boxSeals: BoxSealDetailResponse[] = seals.map((seal) => ({
			name: seal.name,
			description: seal.description,
			logo: this.boxResolutionService.resolveImage(
				seal.logoMediaId,
				dependencies.mediaMap,
			),
		}));

		return {
			id: box.id,
			heroDetail,
			detail,
			containedProducts,
			priceDetail: {
				discartedPrice,
				totalPrice: box.price,
				discountPorcentage,
			},
			boxSeals,
		};
	}
}
