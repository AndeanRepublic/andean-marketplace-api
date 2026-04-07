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
import { Box } from '../../../domain/entities/box/Box';

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

		const [dependencies, seals] = await Promise.all([
			this.boxResolutionService.bulkFetchBoxDependencies([box]),
			this.boxSealRepository.getByIds(box.sealIds),
		]);

		const heroDetail = {
			name: box.name,
			slogan: box.slogan,
			thumbnailImage: this.boxResolutionService.resolveImage(
				box.thumbnailImageId,
				dependencies.mediaMap,
			),
			mainImage: this.boxResolutionService.resolveImage(
				box.mainImageId,
				dependencies.mediaMap,
			),
		};

		const thumbMedia = dependencies.mediaMap.get(box.thumbnailImageId);
		const mainMedia = dependencies.mediaMap.get(box.mainImageId);
		const detail = {
			narrative: box.narrative,
			images: [
				mainMedia
					? this.boxResolutionService.resolveImage(
							box.mainImageId,
							dependencies.mediaMap,
						)
					: null,
				thumbMedia
					? this.boxResolutionService.resolveImage(
							box.thumbnailImageId,
							dependencies.mediaMap,
						)
					: null,
			].filter((img): img is BoxImageResponse => img !== null),
		};

		let discartedPrice = 0;
		const containedProducts: BoxContainedProductResponse[] = [];

		for (const product of box.products) {
			if (product.productId) {
				const superfood = dependencies.superfoodMap.get(product.productId);
				if (superfood) {
					const catalog = this.boxResolutionService.getSuperfoodPrice(
						superfood,
					);
					const price = this.boxResolutionService.resolveLinePrice(
						product,
						catalog,
					);
					discartedPrice += price;

					const narrativeImage = product.narrativeImgId?.trim()
						? this.boxResolutionService.resolveImage(
								product.narrativeImgId,
								dependencies.mediaMap,
							)
						: undefined;

					const row: BoxContainedProductResponse = {
						id: product.productId,
						title: superfood.baseInfo?.title || '',
						thumbnailImage: this.boxResolutionService.resolveImage(
							superfood.baseInfo?.productMedia?.mainImgId,
							dependencies.mediaMap,
						),
						information:
							superfood.baseInfo?.detailedDescription ||
							superfood.baseInfo?.shortDescription ||
							'',
						type: ProductType.SUPERFOOD,
						discartedPrice: price,
						price,
					};
					if (
						narrativeImage &&
						(narrativeImage.url || narrativeImage.name)
					) {
						row.narrativeImage = narrativeImage;
					}
					containedProducts.push(row);
				}
			} else if (product.variantId) {
				const variant = dependencies.variantMap.get(product.variantId);
				if (variant) {
					const catalog = this.boxResolutionService.getVariantPrice(variant);
					const price = this.boxResolutionService.resolveLinePrice(
						product,
						catalog,
					);
					discartedPrice += price;
					const textile = dependencies.textileMap.get(variant.productId);

					const narrativeImage = product.narrativeImgId?.trim()
						? this.boxResolutionService.resolveImage(
								product.narrativeImgId,
								dependencies.mediaMap,
							)
						: undefined;

					const row: BoxContainedProductResponse = {
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
					};
					if (
						narrativeImage &&
						(narrativeImage.url || narrativeImage.name)
					) {
						row.narrativeImage = narrativeImage;
					}
					containedProducts.push(row);
				}
			}
		}

		const discountPorcentage = this.resolveDiscountPercentage(
			box,
			discartedPrice,
		);

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

	private resolveDiscountPercentage(box: Box, discartedPrice: number): number {
		if (
			box.discountPercentage != null &&
			!Number.isNaN(box.discountPercentage)
		) {
			return Math.round(box.discountPercentage);
		}
		return discartedPrice > 0
			? Math.round((1 - box.price / discartedPrice) * 100)
			: 0;
	}
}
