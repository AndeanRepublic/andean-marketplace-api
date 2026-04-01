import { Inject, Injectable } from '@nestjs/common';
import { MediaItemRepository } from '../../../app/datastore/MediaItem.repo';

/**
 * Servicio compartido para resolver IDs de media a URLs completas.
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
	 * Resuelve un mediaId a una URL usable.
	 * Si el valor ya es una URL absoluta o una ruta relativa válida, lo devuelve tal cual.
	 */
	async resolveUrl(mediaId?: string | null): Promise<string> {
		if (!mediaId) return '';

		const trimmed = mediaId.trim();
		if (!trimmed) return '';

		if (
			trimmed.startsWith('http://') ||
			trimmed.startsWith('https://') ||
			trimmed.startsWith('/')
		) {
			return trimmed;
		}

		const mediaMap = await this.resolveUrls([trimmed]);
		return mediaMap.get(trimmed) || '';
	}

	resolveKey(key?: string | null): string {
		if (!key) return '';

		const trimmed = key.trim();
		if (!trimmed) return '';

		return this.buildUrl(trimmed);
	}

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
		return new Map(mediaItems.map((m) => [m.id, this.buildUrl(m.key)]));
	}

	private buildUrl(key: string): string {
		if (!key) return '';
		if (key.startsWith('http://') || key.startsWith('https://')) {
			return key;
		}
		if (key.startsWith('/')) {
			return key;
		}
		if (!this.storageBaseUrl) {
			return key;
		}

		return `${this.storageBaseUrl.replace(/\/$/, '')}/${key.replace(/^\//, '')}`;
	}
}
