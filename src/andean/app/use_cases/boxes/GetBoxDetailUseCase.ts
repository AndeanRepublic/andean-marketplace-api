import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BoxRepository } from '../../datastore/box/Box.repo';
import { BoxSealRepository } from '../../datastore/box/BoxSeal.repo';
import { SuperfoodColorRepository } from '../../datastore/superfoods/SuperfoodColor.repo';
import { SuperfoodSizeOptionAlternativeRepository } from '../../datastore/superfoods/SuperfoodSizeOptionAlternative.repo';
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
import { AdminEntityStatus } from '../../../domain/enums/AdminEntityStatus';
import { SuperfoodOptionName } from '../../../domain/enums/SuperfoodOptionName';
import {
	TextileProductAttributes,
	TextileProductAttributesAssembler,
} from '../../../infra/services/textileProducts/TextileProductAttributesAssembler';

@Injectable()
export class GetBoxDetailUseCase {
	constructor(
		private readonly boxRepository: BoxRepository,
		private readonly boxSealRepository: BoxSealRepository,
		private readonly boxResolutionService: BoxProductResolutionService,
		private readonly ownerInfoResolver: OwnerInfoResolver,
		private readonly textileAttributesAssembler: TextileProductAttributesAssembler,
		@Inject(SuperfoodColorRepository)
		private readonly superfoodColorRepository: SuperfoodColorRepository,
		@Inject(SuperfoodSizeOptionAlternativeRepository)
		private readonly sizeOptionAlternativeRepository: SuperfoodSizeOptionAlternativeRepository,
	) {}

	async handle(boxId: string): Promise<BoxDetailResponse> {
		const box = await this.requireBox(boxId);
		const [dependencies, seals] = await Promise.all([
			this.boxResolutionService.bulkFetchBoxDependencies([box]),
			this.boxSealRepository.getByIds(box.sealIds),
		]);

		// Los logos de sellos no entran en bulkFetchBoxDependencies; hay que cargarlos aparte.
		await this.boxResolutionService.appendMediaToMap(
			dependencies.mediaMap,
			seals.map((seal) => seal.logoMediaId),
		);

		const textileProducts = [...dependencies.textileMap.values()];
		const textileVariants = [...dependencies.variantMap.values()].filter(
			(v) => v.productType === ProductType.TEXTILE,
		);
		const textileAttrsByProductId =
			textileProducts.length > 0
				? await this.textileAttributesAssembler.buildForProducts(
						textileProducts,
						textileVariants,
					)
				: new Map<string, TextileProductAttributes>();
		const superfoodSizeLabelById =
			await this.resolveSuperfoodSizeLabels(dependencies);

		const { containedProducts, discartedPrice } =
			await this.buildContainedProducts(
				box.products,
				dependencies,
				textileAttrsByProductId,
				superfoodSizeLabelById,
			);
		const discartedPriceRounded = Math.round(discartedPrice);

		return {
			id: box.id,
			heroDetail: this.buildHeroDetail(box, dependencies.mediaMap),
			detail: this.buildDescriptionDetail(box, dependencies.mediaMap),
			containedProducts,
			priceDetail: {
				discartedPrice: discartedPriceRounded,
				totalPrice: box.price,
				discountPorcentage: this.resolveDiscountPercentage(
					box,
					discartedPriceRounded,
				),
			},
			boxSeals: this.mapBoxSeals(seals, dependencies.mediaMap),
		};
	}

	private async requireBox(boxId: string): Promise<Box> {
		const box = await this.boxRepository.getById(boxId);
		if (!box || box.status !== AdminEntityStatus.PUBLISHED) {
			throw new NotFoundException('Box not found');
		}
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
		textileAttrsByProductId: Map<string, TextileProductAttributes>,
		superfoodSizeLabelById: Map<string, string>,
	): Promise<{
		containedProducts: BoxContainedProductResponse[];
		discartedPrice: number;
	}> {
		const containedProducts: BoxContainedProductResponse[] = [];
		let discartedPrice = 0;

		for (const line of lines) {
			const resolved = await this.resolveContainedLine(
				line,
				deps,
				textileAttrsByProductId,
				superfoodSizeLabelById,
			);
			if (!resolved) continue;
			containedProducts.push(resolved.row);
			discartedPrice += resolved.linePrice;
		}

		return { containedProducts, discartedPrice };
	}

	private async resolveContainedLine(
		line: BoxProduct,
		deps: BoxDependencies,
		textileAttrsByProductId: Map<string, TextileProductAttributes>,
		superfoodSizeLabelById: Map<string, string>,
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
				superfoodSizeLabelById,
			);
			return row ? { row, linePrice: catalogPrice } : null;
		}

		const row = await this.buildTextileRow(
			variantId,
			variant,
			catalogPrice,
			effectiveLinePrice,
			narrativeImage,
			deps,
			textileAttrsByProductId,
		);
		return { row, linePrice: catalogPrice };
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
		sizeLabelById: Map<string, string>,
	): Promise<BoxContainedProductResponse | null> {
		const superfood = deps.superfoodMap.get(variant.productId);
		if (!superfood) return null;

		const ownerId = superfood.baseInfo?.ownerId ?? '';
		const ownerInfo = await this.ownerInfoResolver.resolveDetailed(
			superfood.baseInfo.ownerType,
			ownerId,
		);

		const row: BoxContainedProductResponse = {
			id: variant.productId,
			variantId,
			title: superfood.baseInfo?.title || '',
			thumbnailImage: this.boxResolutionService.resolveContainedProductThumbnail(
				variant,
				deps.textileMap,
				deps.superfoodMap,
				deps.mediaMap,
			),
			information: superfood.baseInfo?.shortDescription || '',
			type: ProductType.SUPERFOOD,
			discartedPrice: catalogPrice,
			price: effectiveLinePrice,
			ownerId,
		};
		if (ownerInfo) row.ownerInfo = ownerInfo;
		const colorId = superfood.colorId?.trim();
		if (colorId) {
			const catalogColor =
				await this.superfoodColorRepository.getById(colorId);
			const hex = catalogColor?.hexCodeColor?.trim();
			if (hex) {
				row.color = {
					label: catalogColor?.name?.trim() || 'Package',
					hexCode: hex,
				};
			}
		}
		const sizeId = variant.combination?.SIZE?.trim();
		const sizeLabel = sizeId ? sizeLabelById.get(sizeId)?.trim() : undefined;
		if (sizeLabel) row.size = sizeLabel;
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
		textileAttrsByProductId: Map<string, TextileProductAttributes>,
	): Promise<BoxContainedProductResponse> {
		const textile = deps.textileMap.get(variant.productId);
		const ownerId = textile?.baseInfo?.ownerId ?? '';
		const ownerInfo = textile
			? await this.ownerInfoResolver.resolveDetailed(
					textile.baseInfo.ownerType,
					ownerId,
				)
			: undefined;

		const variantInfo = textile
			? textileAttrsByProductId
					.get(variant.productId)
					?.variantInfo.find((v) => v.variantId === variant.id)
			: undefined;
		const combo = variant.combination ?? {};
		const colorLabel =
			variantInfo?.color?.color?.trim() ||
			String(combo.COLOR ?? combo.color ?? combo.Color ?? '').trim();
		const colorHex = variantInfo?.color?.hexCode?.trim() || '#000000';
		const size =
			variantInfo?.size?.trim() ||
			String(combo.SIZE ?? combo.size ?? combo.Size ?? '').trim();

		const row: BoxContainedProductResponse = {
			id: variant.productId,
			variantId,
			title: textile?.baseInfo?.title || '',
			thumbnailImage: this.boxResolutionService.resolveContainedProductThumbnail(
				variant,
				deps.textileMap,
				deps.superfoodMap,
				deps.mediaMap,
			),
			// Campo corto del producto (`information`), no la descripción larga.
			information: textile?.baseInfo?.information || '',
			type: ProductType.TEXTILE,
			discartedPrice: catalogPrice,
			price: effectiveLinePrice,
			ownerId,
			...(colorLabel
				? {
						color: {
							label: colorLabel,
							hexCode: colorHex || '#000000',
						},
					}
				: {}),
			...(size ? { size } : {}),
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

	private async resolveSuperfoodSizeLabels(
		deps: BoxDependencies,
	): Promise<Map<string, string>> {
		const labelById = new Map<string, string>();
		for (const product of deps.superfoodMap.values()) {
			const values =
				product.options?.find(
					(option) => option.name === SuperfoodOptionName.SIZE,
				)?.values ?? [];
			for (const value of values) {
				const alternativeId = value.idOptionAlternative?.trim();
				const label = value.label?.trim();
				if (alternativeId && label) {
					labelById.set(alternativeId, label);
				}
			}
		}

		const missingIds = [
			...new Set(
				[...deps.variantMap.values()]
					.filter((variant) => variant.productType === ProductType.SUPERFOOD)
					.map((variant) => variant.combination?.SIZE?.trim())
					.filter(
						(id): id is string => Boolean(id) && !labelById.has(id),
					),
			),
		];
		if (missingIds.length === 0) return labelById;

		const alternatives =
			await this.sizeOptionAlternativeRepository.getByIds(missingIds);
		for (const alternative of alternatives) {
			const label = alternative.nameLabel?.trim();
			if (label) labelById.set(alternative.id, label);
		}
		return labelById;
	}
}
