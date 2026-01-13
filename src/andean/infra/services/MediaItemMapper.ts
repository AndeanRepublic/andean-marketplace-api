import { MediaItemDocument } from '../persistence/mediaItem.schema';
import { MediaItem } from '../../domain/entities/superfoods/MediaItem';

export class MediaItemMapper {
	static fromDocument(doc: MediaItemDocument): MediaItem {
		return new MediaItem(
			doc.id,
			doc.type,
			doc.name,
			doc.url,
			doc.createdAt,
			doc.updatedAt,
		);
	}

	static toPersistence(entity: MediaItem): any {
		return {
			id: entity.id,
			type: entity.type,
			name: entity.name,
			url: entity.url,
			createdAt: entity.createdAt || new Date(),
			updatedAt: entity.updatedAt || new Date(),
		};
	}
}
