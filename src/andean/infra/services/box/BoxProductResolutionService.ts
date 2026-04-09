import { Injectable } from '@nestjs/common';
import { SuperfoodProductRepository } from '../../../app/datastore/superfoods/SuperfoodProduct.repo';
import { VariantRepository } from '../../../app/datastore/Variant.repo';
import { TextileProductRepository } from '../../../app/datastore/textileProducts/TextileProduct.repo';
import { MediaItemRepository } from '../../../app/datastore/MediaItem.repo';
import { SuperfoodProduct } from '../../../domain/entities/superfoods/SuperfoodProduct';
import { Variant } from '../../../domain/entities/Variant';
import { TextileProduct } from '../../../domain/entities/textileProducts/TextileProduct';
import { MediaItem } from '../../../domain/entities/MediaItem';
import { Box, BoxProduct } from '../../../domain/entities/box/Box';
import { ProductType } from '../../../domain/enums/ProductType';
import { BoxImageResponse } from '../../../app/models/box/BoxImageResponse';
import { MediaUrlResolver } from '../media/MediaUrlResolver';
import { TextileVariantPickerMediaService } from './TextileVariantPickerMediaService';

/** Variantes + media del box (miniatura). Para listado sin catálogo padre. */
export interface BoxListDependencies {
	superfoodMap: Map<string, SuperfoodProduct>;
	textileMap: Map<string, TextileProduct>;
	variantMap: Map<string, Variant>;
	mediaMap: Map<string, MediaItem>;
}

export interface BoxDependencies {
	superfoodMap: Map<string, SuperfoodProduct>;
	variantMap: Map<string, Variant>;
	textileMap: Map<string, TextileProduct>;
	mediaMap: Map<string, MediaItem>;
}

@Injectable()
export class BoxProductResolutionService {
	constructor(
		private readonly superfoodProductRepository: SuperfoodProductRepository,
		private readonly variantRepository: VariantRepository,
		private readonly textileProductRepository: TextileProductRepository,
		private readonly mediaItemRepository: MediaItemRepository,
		private readonly mediaUrlResolver: MediaUrlResolver,
		private readonly textileVariantPickerMediaService: TextileVariantPickerMediaService,
	) {}

	/**
	 * Solo variantes y media de miniatura del box (listado).
	 */
	async bulkFetchBoxDependenciesForList(
		boxes: Box[],
	): Promise<BoxListDependencies> {
		const variantIds = new Set<string>();
		const allMediaIds = new Set<string>();

		for (const box of boxes) {
			allMediaIds.add(box.thumbnailImageId);
			for (const product of box.products) {
				if (product.variantId) variantIds.add(product.variantId);
			}
		}

		const variants =
			variantIds.size > 0
				? await this.variantRepository.getByIds([...variantIds])
				: [];
		const variantMap = new Map<string, Variant>(variants.map((v) => [v.id, v]));

		const textileProductIds = new Set<string>();
		const superfoodProductIds = new Set<string>();
		for (const variant of variants) {
			if (!variant.productId) continue;
			if (variant.productType === ProductType.TEXTILE) {
				textileProductIds.add(variant.productId);
			} else if (variant.productType === ProductType.SUPERFOOD) {
				superfoodProductIds.add(variant.productId);
			}
		}

		const [textiles, superfoods] = await Promise.all([
			this.textileProductRepository.getByIds([...textileProductIds]),
			this.superfoodProductRepository.getByIds([...superfoodProductIds]),
		]);

		const superfoodMap = new Map<string, SuperfoodProduct>(
			superfoods.map((s) => [s.id, s]),
		);
		const textileMap = new Map<string, TextileProduct>(
			textiles.map((t) => [t.id, t]),
		);

		for (const superfood of superfoods) {
			const mainId = superfood.baseInfo?.productMedia?.mainImgId?.trim();
			if (mainId) allMediaIds.add(mainId);
		}
		for (const textile of textiles) {
			if (textile.baseInfo?.mediaIds?.length) {
				const mediaId = textile.baseInfo.mediaIds[0]?.trim();
				if (mediaId) allMediaIds.add(mediaId);
			}
		}

		const mediaItems =
			allMediaIds.size > 0
				? await this.mediaItemRepository.getByIds([...allMediaIds])
				: [];
		const mediaMap = new Map<string, MediaItem>(
			mediaItems.map((m) => [m.id, m]),
		);

		return { superfoodMap, textileMap, variantMap, mediaMap };
	}

	/**
	 * Bulk para detalle: variantes, padres catálogo, media (box, líneas, sellos, productos).
	 */
	async bulkFetchBoxDependencies(boxes: Box[]): Promise<BoxDependencies> {
		const variantIds = new Set<string>();
		const allMediaIds = new Set<string>();

		for (const box of boxes) {
			allMediaIds.add(box.thumbnailImageId);
			allMediaIds.add(box.mainImageId);
			for (const product of box.products) {
				if (product.variantId) variantIds.add(product.variantId);
				const nar = product.narrativeImgId?.trim();
				if (nar) allMediaIds.add(nar);
			}
		}

		const variants =
			variantIds.size > 0
				? await this.variantRepository.getByIds([...variantIds])
				: [];
		const variantMap = new Map<string, Variant>(variants.map((v) => [v.id, v]));

		const textileProductIds = new Set<string>();
		const superfoodProductIds = new Set<string>();
		for (const variant of variants) {
			if (!variant.productId) continue;
			if (variant.productType === ProductType.TEXTILE) {
				textileProductIds.add(variant.productId);
			} else if (variant.productType === ProductType.SUPERFOOD) {
				superfoodProductIds.add(variant.productId);
			}
		}

		const [textiles, superfoods] = await Promise.all([
			this.textileProductRepository.getByIds([...textileProductIds]),
			this.superfoodProductRepository.getByIds([...superfoodProductIds]),
		]);

		const superfoodMap = new Map<string, SuperfoodProduct>(
			superfoods.map((s) => [s.id, s]),
		);
		const textileMap = new Map<string, TextileProduct>(
			textiles.map((t) => [t.id, t]),
		);

		for (const superfood of superfoods) {
			const mainId = superfood.baseInfo?.productMedia?.mainImgId?.trim();
			if (mainId) allMediaIds.add(mainId);
		}
		for (const textile of textiles) {
			if (textile.baseInfo?.mediaIds?.length)
				allMediaIds.add(textile.baseInfo.mediaIds[0]);
		}

		const mediaItems =
			allMediaIds.size > 0
				? await this.mediaItemRepository.getByIds([...allMediaIds])
				: [];
		const mediaMap = new Map<string, MediaItem>(
			mediaItems.map((m) => [m.id, m]),
		);

		return {
			superfoodMap,
			variantMap,
			textileMap,
			mediaMap,
		};
	}

	resolveImage(
		mediaId: string | undefined,
		mediaMap: Map<string, MediaItem>,
	): BoxImageResponse {
		if (!mediaId) return { url: '', name: '' };
		const media = mediaMap.get(mediaId);
		return media
			? { url: this.mediaUrlResolver.resolveKey(media.key), name: media.name }
			: { url: '', name: '' };
	}

	getVariantPrice(variant: Variant): number {
		return variant.price;
	}

	resolveLinePrice(product: BoxProduct, catalogPrice: number): number {
		if (
			product.boxPrice != null &&
			!Number.isNaN(product.boxPrice) &&
			product.boxPrice > 0
		) {
			return product.boxPrice;
		}
		return catalogPrice;
	}

	resolveListProductThumbnailUrl(
		variant: Variant,
		textileMap: Map<string, TextileProduct>,
		superfoodMap: Map<string, SuperfoodProduct>,
		mediaMap: Map<string, MediaItem>,
	): string {
		// Priority 1: variant image when available (textile picker heuristic)
		if (variant.productType === ProductType.TEXTILE) {
			const textile = textileMap.get(variant.productId);
			if (textile) {
				const variantMediaId =
					this.textileVariantPickerMediaService.resolveVariantMainMediaId(
						textile,
						variant,
					);
				if (variantMediaId) {
					return this.resolveImage(variantMediaId, mediaMap).url;
				}
			}
		}

		// Priority 2: fallback to product image
		if (variant.productType === ProductType.SUPERFOOD) {
			const superfood = superfoodMap.get(variant.productId);
			const mediaId = superfood?.baseInfo?.productMedia?.mainImgId?.trim();
			return mediaId ? this.resolveImage(mediaId, mediaMap).url : '';
		}

		if (variant.productType === ProductType.TEXTILE) {
			const textile = textileMap.get(variant.productId);
			const mediaId = textile?.baseInfo?.mediaIds?.[0]?.trim();
			return mediaId ? this.resolveImage(mediaId, mediaMap).url : '';
		}

		return '';
	}
}
