export class DetailSourceProduct {
	constructor(
		public id: string,
		public name: string,
		public description: string,
		public features: string[],
		public createdAt: Date,
		public updatedAt: Date,
	) {}
}
