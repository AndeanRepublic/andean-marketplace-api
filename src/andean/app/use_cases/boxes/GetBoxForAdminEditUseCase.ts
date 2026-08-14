import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BoxRepository } from '../../datastore/box/Box.repo';
import { VariantRepository } from '../../datastore/Variant.repo';
import { SuperfoodSizeOptionAlternativeRepository } from '../../datastore/superfoods/SuperfoodSizeOptionAlternative.repo';
import { SuperfoodCategoryRepository } from '../../datastore/superfoods/SuperfoodCategory.repo';
import { TextileCategoryRepository } from '../../datastore/textileProducts/TextileCategory.repo';
import { BoxProductResolutionService } from '../../../infra/services/box/BoxProductResolutionService';
import { TextileVariantPickerMediaService } from '../../../infra/services/box/TextileVariantPickerMediaService';
import { MediaUrlResolver } from '../../../infra/services/media/MediaUrlResolver';
import { collectSuperfoodMediaIds } from './GetBoxCatalogSuperfoodProductMediaUseCase';
import {
	BoxAdminEditResponse,
	BoxAdminEditSlotDto,
} from '../../models/box/BoxAdminEditResponse';
import {
	BoxCatalogMediaItemDto,
	BoxCatalogVariantItemDto,
} from '../../models/box/catalog/BoxCatalogResponses';
import { BoxProduct } from '../../../domain/entities/box/Box';
import { SuperfoodProduct } from '../../../domain/entities/superfoods/SuperfoodProduct';
import { TextileProduct } from '../../../domain/entities/textileProducts/TextileProduct';
import { Variant } from '../../../domain/entities/Variant';
import { ProductType } from '../../../domain/enums/ProductType';
import { BoxProductType } from '../../../domain/enums/BoxProductType';

const SLOT_COUNT = 3;

@Injectable()
export class GetBoxForAdminEditUseCase {
	constructor(
		private readonly boxRepository: BoxRepository,
		private readonly boxResolutionService: BoxProductResolutionService,
		@Inject(VariantRepository)
		private readonly variantRepository: VariantRepository,
		@Inject(SuperfoodSizeOptionAlternativeRepository)
		private readonly sizeOptionAlternativeRepository: SuperfoodSizeOptionAlternativeRepository,
		@Inject(SuperfoodCategoryRepository)
		private readonly superfoodCategoryRepository: SuperfoodCategoryRepository,
		@Inject(TextileCategoryRepository)
		private readonly textileCategoryRepository: TextileCategoryRepository,
		private readonly textileVariantPickerMediaService: TextileVariantPickerMediaService,
		private readonly mediaUrlResolver: MediaUrlResolver,
	) {}

	async handle(boxId: string): Promise<BoxAdminEditResponse> {
		const box = await this.boxRepository.getById(boxId);
		if (!box) {
			throw new NotFoundException(`Box with id ${boxId} not found`);
		}

		const deps = await this.boxResolutionService.bulkFetchBoxDependencies([
			box,
		]);

		const productIds = [
			...new Set(
				[...deps.variantMap.values()]
					.map((variant) => variant.productId?.trim())
					.filter((id): id is string => Boolean(id)),
			),
		];

		const variantsByProductId = new Map<string, Variant[]>();
		await Promise.all(
			productIds.map(async (productId) => {
				const list = await this.variantRepository.getByProductId(productId);
				variantsByProductId.set(productId, list);
			}),
		);

		const sizeAlternativeIds = [
			...new Set(
				[...variantsByProductId.values()]
					.flat()
					.filter((variant) => variant.productType === ProductType.SUPERFOOD)
					.map((variant) => variant.combination?.SIZE?.trim())
					.filter((id): id is string => Boolean(id)),
			),
		];
		const sizeAlternatives =
			sizeAlternativeIds.length > 0
				? await this.sizeOptionAlternativeRepository.getByIds(
						sizeAlternativeIds,
					)
				: [];
		const sizeLabelById = new Map(
			sizeAlternatives.map((option) => [option.id, option.nameLabel]),
		);

		const superfoodCategoryIds = [
			...new Set(
				[...deps.superfoodMap.values()]
					.map((product) => product.categoryId?.trim())
					.filter((id): id is string => Boolean(id)),
			),
		];
		const textileCategoryIds = [
			...new Set(
				[...deps.textileMap.values()]
					.map((product) => product.categoryId?.trim())
					.filter((id): id is string => Boolean(id)),
			),
		];
		const [superfoodCategories, textileCategories] = await Promise.all([
			Promise.all(
				superfoodCategoryIds.map((id) =>
					this.superfoodCategoryRepository.getCategoryById(id),
				),
			),
			Promise.all(
				textileCategoryIds.map((id) =>
					this.textileCategoryRepository.getCategoryById(id),
				),
			),
		]);
		const superfoodCategoryNameById = new Map(
			superfoodCategories
				.filter((category): category is NonNullable<typeof category> =>
					Boolean(category),
				)
				.map((category) => [category.id, category.name]),
		);
		const textileCategoryNameById = new Map(
			textileCategories
				.filter((category): category is NonNullable<typeof category> =>
					Boolean(category),
				)
				.map((category) => [category.id, category.name]),
		);

		const mediaIds = new Set<string>();
		for (const product of deps.superfoodMap.values()) {
			for (const id of collectSuperfoodMediaIds(
				product.baseInfo?.productMedia,
			)) {
				mediaIds.add(id);
			}
		}
		for (const product of deps.textileMap.values()) {
			for (const id of product.baseInfo?.mediaIds ?? []) {
				const trimmed = id?.trim();
				if (trimmed) mediaIds.add(trimmed);
			}
			const productVariants = variantsByProductId.get(product.id) ?? [];
			for (const variant of productVariants) {
				const mid =
					this.textileVariantPickerMediaService.resolveVariantMainMediaId(
						product,
						variant,
					);
				if (mid) mediaIds.add(mid);
			}
		}
		for (const line of box.products) {
			const nar = line.narrativeImgId?.trim();
			if (nar) mediaIds.add(nar);
		}

		const urlMap = await this.mediaUrlResolver.resolveUrls([...mediaIds]);

		const slots: BoxAdminEditSlotDto[] = [];
		for (let i = 0; i < SLOT_COUNT; i++) {
			slots.push(
				this.buildSlot(
					box.products[i],
					deps.variantMap,
					deps.superfoodMap,
					deps.textileMap,
					variantsByProductId,
					sizeLabelById,
					superfoodCategoryNameById,
					textileCategoryNameById,
					urlMap,
				),
			);
		}

		return {
			id: box.id,
			name: box.name,
			slogan: box.slogan,
			narrative: box.narrative,
			thumbnailImageId: box.thumbnailImageId,
			mainImageId: box.mainImageId,
			products: box.products,
			price: box.price,
			discountPercentage: box.discountPercentage,
			sealIds: box.sealIds ?? [],
			status: box.status,
			createdAt: box.createdAt,
			updatedAt: box.updatedAt,
			slots,
		};
	}

	private buildSlot(
		line: BoxProduct | undefined,
		variantMap: Map<string, Variant>,
		superfoodMap: Map<string, SuperfoodProduct>,
		textileMap: Map<string, TextileProduct>,
		variantsByProductId: Map<string, Variant[]>,
		sizeLabelById: Map<string, string>,
		superfoodCategoryNameById: Map<string, string>,
		textileCategoryNameById: Map<string, string>,
		urlMap: Map<string, string>,
	): BoxAdminEditSlotDto {
		const empty = this.emptySlot();
		const variantId = line?.variantId?.trim();
		if (!line || !variantId) return empty;

		const productType =
			line.productType === BoxProductType.SUPERFOOD ||
			line.productType === BoxProductType.TEXTILE
				? line.productType
				: null;
		const variant = variantMap.get(variantId);
		if (!variant) {
			return {
				...empty,
				productType,
				variantId,
				boxPrice: line.boxPrice,
				narrativeImgId: line.narrativeImgId?.trim() || null,
			};
		}

		if (variant.productType === ProductType.SUPERFOOD) {
			const product = superfoodMap.get(variant.productId);
			const productVariants =
				variantsByProductId.get(variant.productId) ?? [variant];
			const mainImgId = product?.baseInfo?.productMedia?.mainImgId?.trim();
			const imgUrl = mainImgId ? (urlMap.get(mainImgId) ?? '') : '';
			const variants = productVariants
				.filter((item) => item.productType === ProductType.SUPERFOOD)
				.map((item) =>
					this.toSuperfoodVariantDto(item, imgUrl, sizeLabelById),
				);
			const selected =
				variants.find((item) => item.id === variantId) ?? variants[0];
			const narrativeMedia = this.toSuperfoodNarrativeMedia(product, urlMap);
			const narrativeImgId =
				line.narrativeImgId?.trim() || narrativeMedia[0]?.id || null;
			return {
				productType: BoxProductType.SUPERFOOD,
				productId: variant.productId,
				variantId,
				productTitle: product?.baseInfo?.title ?? '',
				categoryName: product?.categoryId
					? (superfoodCategoryNameById.get(product.categoryId) ?? '')
					: '',
				variantLabel: selected?.label ?? '',
				catalogPrice: selected?.price ?? variant.price,
				stock: selected?.stock ?? variant.stock,
				imageUrl: selected?.imgUrl || imgUrl,
				boxPrice: line.boxPrice,
				narrativeImgId,
				variants,
				narrativeMedia,
			};
		}

		if (variant.productType === ProductType.TEXTILE) {
			const product = textileMap.get(variant.productId);
			const productVariants =
				variantsByProductId.get(variant.productId) ?? [variant];
			const textileVariants = productVariants.filter(
				(item) => item.productType === ProductType.TEXTILE,
			);
			const variants = textileVariants.map((item) =>
				this.toTextileVariantDto(item, product, urlMap),
			);
			const selected =
				variants.find((item) => item.id === variantId) ?? variants[0];
			const narrativeMedia = this.toTextileNarrativeMedia(product, urlMap);
			const fallbackImg =
				product?.baseInfo?.mediaIds?.[0]?.trim()
					? (urlMap.get(product.baseInfo.mediaIds[0].trim()) ?? '')
					: '';
			const narrativeImgId =
				line.narrativeImgId?.trim() || narrativeMedia[0]?.id || null;
			return {
				productType: BoxProductType.TEXTILE,
				productId: variant.productId,
				variantId,
				productTitle: product?.baseInfo?.title ?? '',
				categoryName: product?.categoryId
					? (textileCategoryNameById.get(product.categoryId) ?? '')
					: '',
				variantLabel: selected?.label ?? '',
				catalogPrice: selected?.price ?? variant.price,
				stock: selected?.stock ?? variant.stock,
				imageUrl: selected?.imgUrl || fallbackImg,
				boxPrice: line.boxPrice,
				narrativeImgId,
				variants,
				narrativeMedia,
			};
		}

		return {
			...empty,
			productType,
			variantId,
			boxPrice: line.boxPrice,
			narrativeImgId: line.narrativeImgId?.trim() || null,
		};
	}

	private emptySlot(): BoxAdminEditSlotDto {
		return {
			productType: null,
			productId: null,
			variantId: null,
			productTitle: '',
			categoryName: '',
			variantLabel: '',
			catalogPrice: 0,
			stock: 0,
			imageUrl: '',
			narrativeImgId: null,
			variants: [],
			narrativeMedia: [],
		};
	}

	private toSuperfoodVariantDto(
		variant: Variant,
		imgUrl: string,
		sizeLabelById: Map<string, string>,
	): BoxCatalogVariantItemDto {
		const sizeId = variant.combination?.SIZE?.trim();
		return {
			id: variant.id,
			label:
				(sizeId ? sizeLabelById.get(sizeId) : undefined) ||
				(sizeId ? `Size ${sizeId}` : 'Superfood variant'),
			imgUrl,
			price: variant.price,
			stock: variant.stock,
			combination: { ...variant.combination },
		};
	}

	private toTextileVariantDto(
		variant: Variant,
		product: TextileProduct | undefined,
		urlMap: Map<string, string>,
	): BoxCatalogVariantItemDto {
		const mediaId = product
			? this.textileVariantPickerMediaService.resolveVariantMainMediaId(
					product,
					variant,
				)
			: null;
		return {
			id: variant.id,
			label: this.textileVariantPickerMediaService.buildVariantLabel(variant),
			imgUrl: mediaId ? (urlMap.get(mediaId) ?? '') : '',
			price: variant.price,
			stock: variant.stock,
			combination: { ...variant.combination },
		};
	}

	private toSuperfoodNarrativeMedia(
		product: SuperfoodProduct | undefined,
		urlMap: Map<string, string>,
	): BoxCatalogMediaItemDto[] {
		const ids = collectSuperfoodMediaIds(product?.baseInfo?.productMedia);
		return ids.map((id) => ({ id, url: urlMap.get(id) ?? '' }));
	}

	private toTextileNarrativeMedia(
		product: TextileProduct | undefined,
		urlMap: Map<string, string>,
	): BoxCatalogMediaItemDto[] {
		const ids = [
			...new Set(
				(product?.baseInfo?.mediaIds ?? [])
					.map((id) => id?.trim())
					.filter((id): id is string => Boolean(id)),
			),
		];
		return ids.map((id) => ({ id, url: urlMap.get(id) ?? '' }));
	}
}
