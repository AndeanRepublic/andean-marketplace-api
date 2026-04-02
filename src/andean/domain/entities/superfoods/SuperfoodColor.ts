/** Color superfood persistido en catálogo (`SuperfoodColor` / `superfood-colors`). */
export class SuperfoodColor {
	constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly hexCodeColor: string,
		public readonly createdAt?: Date,
		public readonly updatedAt?: Date,
	) {}
}
