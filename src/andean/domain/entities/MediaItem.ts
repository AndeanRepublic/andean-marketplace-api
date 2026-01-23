export class MediaItem {
	constructor(
		public readonly id: string,
		public readonly type: string,
		public readonly name: string,
		public readonly url: string,
		public readonly createdAt?: Date,
		public readonly updatedAt?: Date,
	) {}
}
