import { Inject, Injectable } from '@nestjs/common';
import { MediaItemRepository } from '../../../app/datastore/MediaItem.repo';
import { MediaUrlResolver } from '../media/MediaUrlResolver';
import type {
	MediaInfo,
	SuperfoodProductListAggregateRow,
	SuperfoodProductListItem,
} from '../../../app/models/superfoods/SuperfoodProductListItem';

/**
 * Resuelve `mainImage` y `productPackageOutImage` del listado de superfoods a partir de
 * los IDs en `baseInfo.productMedia`, en batch (similar a {@link SuperfoodProductListColorResolver}).
 * Las URLs usan {@link MediaUrlResolver.resolveKey} (mismo criterio que textiles / listados).
 */
@Injectable()
export class SuperfoodProductListMediaResolver {
	constructor(
		@Inject(MediaItemRepository)
		private readonly mediaItemRepository: MediaItemRepository,
		private readonly mediaUrlResolver: MediaUrlResolver,
	) {}

	async attachListMediaFromAggregate(
		rows: SuperfoodProductListAggregateRow[],
	): Promise<Array<SuperfoodProductListItem & { colorId?: string | null }>> {
		const ids = [
			...new Set(
				rows
					.flatMap((r) => [r.mainImgId, r.productPackageOutImgId])
					.filter(
						(id): id is string =>
							typeof id === 'string' && id.trim().length > 0,
					)
					.map((id) => id.trim()),
			),
		];

		const items = ids.length
			? await this.mediaItemRepository.getByIds(ids)
			: [];
		const byId = new Map(items.map((m) => [m.id, m]));

		return rows.map(({ mainImgId, productPackageOutImgId, ...rest }) => {
			const mainKey = mainImgId?.trim();
			const outKey = productPackageOutImgId?.trim();
			const main = mainKey ? byId.get(mainKey) : undefined;
			const packageOut = outKey ? byId.get(outKey) : undefined;
			return {
				...rest,
				mainImage: this.toMediaInfo(main),
				productPackageOutImage: this.toMediaInfo(packageOut),
			};
		});
	}

	private emptyMedia(): MediaInfo {
		return { name: '', url: '' };
	}

	private toMediaInfo(m: { name: string; key: string } | undefined): MediaInfo {
		if (!m) return this.emptyMedia();
		return {
			name: m.name,
			url: this.mediaUrlResolver.resolveKey(m.key),
		};
	}
}
