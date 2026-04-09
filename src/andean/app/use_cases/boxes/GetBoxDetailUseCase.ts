import { Injectable, NotFoundException } from '@nestjs/common';
import { BoxRepository } from '../../datastore/box/Box.repo';
import { BoxSealRepository } from '../../datastore/box/BoxSeal.repo';
import {
	BoxDetailResponse,
	BoxContainedProductResponse,
	BoxDetailHeroResponse,
	BoxDetailDescriptionResponse,
	BoxSealDetailResponse,
} from '../../models/box/BoxDetailResponse';
import { BoxImageResponse } from '../../models/box/BoxImageResponse';
import { ProductType } from '../../../domain/enums/ProductType';
import {
	BoxDependencies,
	BoxProductResolutionService,
} from '../../../infra/services/box/BoxProductResolutionService';
import { OwnerInfoResolver } from '../../../infra/services/owner/OwnerInfoResolver';
import { Box, BoxProduct } from '../../../domain/entities/box/Box';
import { BoxSeal } from '../../../domain/entities/box/BoxSeal';
import { Variant } from '../../../domain/entities/Variant';
import { MediaItem } from '../../../domain/entities/MediaItem';

@Injectable()
export class GetBoxDetailUseCase {
	constructor(
		private readonly boxRepository: BoxRepository,
		private readonly boxSealRepository: BoxSealRepository,
		private readonly boxResolutionService: BoxProductResolutionService,
		private readonly ownerInfoResolver: OwnerInfoResolver,
	) {}

	async handle(boxId: string): Promise<BoxDetailResponse> {
		const box = await this.requireBox(boxId);
		const [dependencies, seals] = await Promise.all([
			this.boxResolutionService.bulkFetchBoxDependencies([box]),
			this.boxSealRepository.getByIds(box.sealIds),
		]);

		const { containedProducts, discartedPrice } =
			await this.buildContainedProducts(box.products, dependencies);

		return {
			id: box.id,
			heroDetail: this.buildHeroDetail(box, dependencies.mediaMap),
			detail: this.buildDescriptionDetail(box, dependencies.mediaMap),
			containedProducts,
			priceDetail: {
				discartedPrice,
				totalPrice: box.price,
				discountPorcentage: this.resolveDiscountPercentage(box, discartedPrice),
			},
			boxSeals: this.mapBoxSeals(seals, dependencies.mediaMap),
		};
	}

	private async requireBox(boxId: string): Promise<Box> {
		const box = await this.boxRepository.getById(boxId);
		if (!box) throw new NotFoundException('Box not found');
		return box;
	}

	private buildHeroDetail(
		box: Box,
		mediaMap: Map<string, MediaItem>,
	): BoxDetailHeroResponse {
		return {
			name: box.name,
			slogan: box.slogan,
			thumbnailImage: this.boxResolutionService.resolveImage(
				box.thumbnailImageId,
				mediaMap,
			),
			mainImage: this.boxResolutionService.resolveImage(
				box.mainImageId,
				mediaMap,
			),
		};
	}

	private buildDescriptionDetail(
		box: Box,
		mediaMap: Map<string, MediaItem>,
	): BoxDetailDescriptionResponse {
		const mainMedia = mediaMap.get(box.mainImageId);
		const thumbMedia = mediaMap.get(box.thumbnailImageId);
		const images: BoxImageResponse[] = [];
		if (mainMedia) {
			images.push(
				this.boxResolutionService.resolveImage(box.mainImageId, mediaMap),
			);
		}
		if (thumbMedia) {
			images.push(
				this.boxResolutionService.resolveImage(box.thumbnailImageId, mediaMap),
			);
		}
		return { narrative: box.narrative, images };
	}

	private async buildContainedProducts(
		lines: BoxProduct[],
		deps: BoxDependencies,
	): Promise<{
		containedProducts: BoxContainedProductResponse[];
		discartedPrice: number;
	}> {
		const containedProducts: BoxContainedProductResponse[] = [];
		let discartedPrice = 0;

		for (const line of lines) {
			const resolved = await this.resolveContainedLine(line, deps);
			if (!resolved) continue;
			containedProducts.push(resolved.row);
			discartedPrice += resolved.linePrice;
		}

		return { containedProducts, discartedPrice };
	}

	private async resolveContainedLine(
		line: BoxProduct,
		deps: BoxDependencies,
	): Promise<{
		row: BoxContainedProductResponse;
		linePrice: number;
	} | null> {
		const variantId = line.variantId;
		if (!variantId) return null;
		const variant = deps.variantMap.get(variantId);
		if (!variant) return null;

		const catalogPrice = this.boxResolutionService.getVariantPrice(variant);
		const effectiveLinePrice = this.boxResolutionService.resolveLinePrice(
			line,
			catalogPrice,
		);
		const narrativeImage = this.resolveNarrativeImage(line, deps.mediaMap);

		if (variant.productType === ProductType.SUPERFOOD) {
			const row = await this.buildSuperfoodRow(
				variantId,
				variant,
				catalogPrice,
				effectiveLinePrice,
				narrativeImage,
				deps,
			);
			return row ? { row, linePrice: effectiveLinePrice } : null;
		}

		const row = await this.buildTextileRow(
			variantId,
			variant,
			catalogPrice,
			effectiveLinePrice,
			narrativeImage,
			deps,
		);
		return { row, linePrice: effectiveLinePrice };
	}

	private resolveNarrativeImage(
		line: BoxProduct,
		mediaMap: Map<string, MediaItem>,
	): BoxImageResponse | undefined {
		const id = line.narrativeImgId?.trim();
		if (!id) return undefined;
		return this.boxResolutionService.resolveImage(id, mediaMap);
	}

	private applyNarrativeImageIfPresent(
		row: BoxContainedProductResponse,
		narrativeImage: BoxImageResponse | undefined,
	): void {
		if (narrativeImage?.url || narrativeImage?.name) {
			row.narrativeImage = narrativeImage;
		}
	}

	private async buildSuperfoodRow(
		variantId: string,
		variant: Variant,
		catalogPrice: number,
		effectiveLinePrice: number,
		narrativeImage: BoxImageResponse | undefined,
		deps: BoxDependencies,
	): Promise<BoxContainedProductResponse | null> {
		const superfood = deps.superfoodMap.get(variant.productId);
		if (!superfood) return null;

		const ownerId = superfood.baseInfo?.ownerId ?? '';
		const ownerInfo = await this.ownerInfoResolver.resolveDetailed(
			superfood.baseInfo.ownerType,
			ownerId,
		);

		const row: BoxContainedProductResponse = {
			id: variantId,
			title: superfood.baseInfo?.title || '',
			thumbnailImage: this.boxResolutionService.resolveImage(
				superfood.baseInfo?.productMedia?.mainImgId,
				deps.mediaMap,
			),
			information: superfood.baseInfo?.shortDescription || '',
			type: ProductType.SUPERFOOD,
			discartedPrice: catalogPrice,
			price: effectiveLinePrice,
			ownerId,
		};
		if (ownerInfo) row.ownerInfo = ownerInfo;
		this.applyNarrativeImageIfPresent(row, narrativeImage);
		return row;
	}

	private async buildTextileRow(
		variantId: string,
		variant: Variant,
		catalogPrice: number,
		effectiveLinePrice: number,
		narrativeImage: BoxImageResponse | undefined,
		deps: BoxDependencies,
	): Promise<BoxContainedProductResponse> {
		const textile = deps.textileMap.get(variant.productId);
		const ownerId = textile?.baseInfo?.ownerId ?? '';
		const ownerInfo = textile
			? await this.ownerInfoResolver.resolveDetailed(
					textile.baseInfo.ownerType,
					ownerId,
				)
			: undefined;

		const row: BoxContainedProductResponse = {
			id: variantId,
			title: textile?.baseInfo?.title || '',
			thumbnailImage: this.boxResolutionService.resolveImage(
				textile?.baseInfo?.mediaIds?.[0],
				deps.mediaMap,
			),
			information: textile?.baseInfo?.description || '',
			type: ProductType.TEXTILE,
			discartedPrice: catalogPrice,
			price: effectiveLinePrice,
			ownerId,
		};
		if (ownerInfo) row.ownerInfo = ownerInfo;
		this.applyNarrativeImageIfPresent(row, narrativeImage);
		return row;
	}

	private mapBoxSeals(
		seals: BoxSeal[],
		mediaMap: Map<string, MediaItem>,
	): BoxSealDetailResponse[] {
		return seals.map((seal) => ({
			name: seal.name,
			description: seal.description,
			logo: this.boxResolutionService.resolveImage(seal.logoMediaId, mediaMap),
		}));
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
