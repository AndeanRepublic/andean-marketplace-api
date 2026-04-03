import { Injectable } from '@nestjs/common';
import { SuperfoodProductRepository } from '../../../app/datastore/superfoods/SuperfoodProduct.repo';
import { VariantRepository } from '../../../app/datastore/Variant.repo';
import { TextileProductRepository } from '../../../app/datastore/textileProducts/TextileProduct.repo';
import { CommunityRepository } from '../../../app/datastore/community/community.repo';
import { MediaItemRepository } from '../../../app/datastore/MediaItem.repo';
import { SuperfoodProduct } from '../../../domain/entities/superfoods/SuperfoodProduct';
import { Variant } from '../../../domain/entities/Variant';
import { TextileProduct } from '../../../domain/entities/textileProducts/TextileProduct';
import { Community } from '../../../domain/entities/community/Community';
import { MediaItem } from '../../../domain/entities/MediaItem';
import { Box, BoxProduct } from '../../../domain/entities/box/Box';
import { BoxImageResponse } from '../../../app/models/box/BoxImageResponse';
import { MediaUrlResolver } from '../media/MediaUrlResolver';

export interface BoxDependencies {
	superfoodMap: Map<string, SuperfoodProduct>;
	variantMap: Map<string, Variant>;
	textileMap: Map<string, TextileProduct>;
	communityMap: Map<string, Community>;
	mediaMap: Map<string, MediaItem>;
}

@Injectable()
export class BoxProductResolutionService {
	constructor(
		private readonly superfoodProductRepository: SuperfoodProductRepository,
		private readonly variantRepository: VariantRepository,
		private readonly textileProductRepository: TextileProductRepository,
		private readonly communityRepository: CommunityRepository,
		private readonly mediaItemRepository: MediaItemRepository,
		private readonly mediaUrlResolver: MediaUrlResolver,
	) {}

	/**
	 * Bulk fetch all dependencies needed to resolve box products
	 * Uses parallel queries and $in operator to minimize database roundtrips
	 */
	async bulkFetchBoxDependencies(boxes: Box[]): Promise<BoxDependencies> {
		// 1. Collect all unique IDs across all boxes
		const allSuperfoodIds = new Set<string>();
		const allVariantIds = new Set<string>();
		const allMediaIds = new Set<string>();

		for (const box of boxes) {
			allMediaIds.add(box.thumbnailImageId);
			allMediaIds.add(box.mainImageId);
			for (const product of box.products) {
				if (product.productId) allSuperfoodIds.add(product.productId);
				if (product.variantId) allVariantIds.add(product.variantId);
			}
		}

		// 2. Bulk fetch superfoods and variants in parallel
		const [superfoods, variants] = await Promise.all([
			this.superfoodProductRepository.getByIds([...allSuperfoodIds]),
			this.variantRepository.getByIds([...allVariantIds]),
		]);

		const superfoodMap = new Map<string, SuperfoodProduct>(
			superfoods.map((s) => [s.id, s]),
		);
		const variantMap = new Map<string, Variant>(variants.map((v) => [v.id, v]));

		// 3. Collect textile IDs from resolved variants + owner IDs + media IDs
		const allTextileIds = new Set<string>();
		const allOwnerIds = new Set<string>();

		for (const superfood of superfoods) {
			if (superfood.baseInfo?.ownerId)
				allOwnerIds.add(superfood.baseInfo.ownerId);
			const mainId = superfood.baseInfo?.productMedia?.mainImgId?.trim();
			if (mainId) allMediaIds.add(mainId);
		}
		for (const variant of variants) {
			if (variant.productId) allTextileIds.add(variant.productId);
		}

		// 4. Bulk fetch textiles
		const textiles = await this.textileProductRepository.getByIds([
			...allTextileIds,
		]);
		const textileMap = new Map<string, TextileProduct>(
			textiles.map((t) => [t.id, t]),
		);

		// 5. Collect owner/media IDs from textiles
		for (const textile of textiles) {
			if (textile.baseInfo?.ownerId) allOwnerIds.add(textile.baseInfo.ownerId);
			if (textile.baseInfo?.mediaIds?.length)
				allMediaIds.add(textile.baseInfo.mediaIds[0]);
		}

		// 6. Bulk fetch communities and media items in parallel
		const [communities, mediaItems] = await Promise.all([
			this.communityRepository.getByIds([...allOwnerIds]),
			this.mediaItemRepository.getByIds([...allMediaIds]),
		]);

		const communityMap = new Map<string, Community>(
			communities.map((c) => [c.id, c]),
		);
		const mediaMap = new Map<string, MediaItem>(
			mediaItems.map((m) => [m.id, m]),
		);

		return {
			superfoodMap,
			variantMap,
			textileMap,
			communityMap,
			mediaMap,
		};
	}

	/**
	 * Resolve media item to image response
	 */
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

	/**
	 * Get superfood product price
	 */
	getSuperfoodPrice(superfood: SuperfoodProduct): number {
		return superfood.priceInventory?.basePrice || 0;
	}

	/**
	 * Get variant price
	 */
	getVariantPrice(variant: Variant): number {
		return variant.price;
	}

	/**
	 * Resolve community name from owner ID
	 */
	resolveCommunityName(
		ownerId: string | undefined,
		communityMap: Map<string, Community>,
	): string {
		if (!ownerId) return '';
		return communityMap.get(ownerId)?.name || '';
	}
}
