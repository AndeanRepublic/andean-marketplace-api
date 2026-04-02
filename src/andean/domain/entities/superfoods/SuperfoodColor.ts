/**
 * Color superfood: fila en colección `superfood-colors` o snapshot embebido en
 * `SuperfoodProduct.color` (id vacío si no enlaza al catálogo).
 */
export class SuperfoodColor {
	constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly hexCodeColor: string,
		public readonly createdAt?: Date,
		public readonly updatedAt?: Date,
	) {}
}
