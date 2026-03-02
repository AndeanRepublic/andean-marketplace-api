export class SuperfoodCategory {
	constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly status: 'ENABLED' | 'DISABLED',
		public readonly createdAt?: Date,
		public readonly updatedAt?: Date,
	) {}
}
