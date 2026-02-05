export class MediaItem {
	constructor(
		public readonly id: string,
		public readonly type: string,
		public readonly name: string,
		public readonly key: string, // Path dentro del bucket (ej: products/uuid-file.jpg)
		public readonly createdAt?: Date,
		public readonly updatedAt?: Date,
	) {}
}
