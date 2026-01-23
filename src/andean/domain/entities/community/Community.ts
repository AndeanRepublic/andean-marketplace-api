export class Community {
	constructor(
		public id: string,
		public name: string,
		public bannerImageUrl: string,
		public createdAt: Date,
		public updatedAt: Date,
		public seals?: string[],
	) {}
}
