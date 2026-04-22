export class SuperfoodBenefit {
	constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly description: string,
		public readonly hexCodeColor?: string,
		public readonly iconId?: string,
		public readonly createdAt?: Date,
		public readonly updatedAt?: Date,
	) {}
}
