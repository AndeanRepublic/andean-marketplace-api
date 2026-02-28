import { MediaItemType } from '../enums/MediaItemType';
import { MediaItemRole } from '../enums/MediaItemRole';

export class MediaItem {
	constructor(
		public readonly id: string,
		public readonly type: MediaItemType,
		public readonly name: string,
		public readonly key: string, // Path dentro del bucket (ej: products/uuid-file.jpg)
		public readonly role: MediaItemRole = MediaItemRole.NONE,
		public readonly createdAt?: Date,
		public readonly updatedAt?: Date,
	) {}
}
