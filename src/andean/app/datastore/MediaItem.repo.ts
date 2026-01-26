import { MediaItem } from '../../domain/entities/MediaItem';

export abstract class MediaItemRepository {
	abstract getById(id: string): Promise<MediaItem | null>;

	abstract getAll(): Promise<MediaItem[]>;

	abstract save(mediaItem: MediaItem): Promise<MediaItem>;

	abstract update(mediaItem: MediaItem): Promise<MediaItem>;

	abstract delete(id: string): Promise<void>;
}
