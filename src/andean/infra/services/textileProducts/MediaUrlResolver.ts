import { Inject, Injectable } from '@nestjs/common';
import { MediaItemRepository } from '../../../app/datastore/MediaItem.repo';

/**
 * Servicio para resolver IDs de media a URLs completas.
 * Usa MediaItemRepository y STORAGE_BASE_URL para construir las URLs.
 */
@Injectable()
export class MediaUrlResolver {
	private readonly storageBaseUrl = process.env.STORAGE_BASE_URL || '';

	constructor(
		@Inject(MediaItemRepository)
		private readonly mediaItemRepository: MediaItemRepository,
	) {}

	/**
	 * Resuelve una lista de mediaIds a un Map de id -> url.
	 * Los IDs vacíos o duplicados se filtran antes de la consulta.
	 */
	async resolveUrls(mediaIds: string[]): Promise<Map<string, string>> {
		const uniqueIds = [
			...new Set(mediaIds.filter((id): id is string => Boolean(id))),
		];

		if (uniqueIds.length === 0) {
			return new Map();
		}

		const mediaItems = await this.mediaItemRepository.getByIds(uniqueIds);
		return new Map(
			mediaItems.map((m) => [m.id, `${this.storageBaseUrl}/${m.key}`]),
		);
	}
}
