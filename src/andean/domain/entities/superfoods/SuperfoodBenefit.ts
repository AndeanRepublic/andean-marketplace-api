export class SuperfoodBenefit {
	constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly icon?: string,
		public readonly createdAt?: Date,
		public readonly updatedAt?: Date,
	) { }
}
