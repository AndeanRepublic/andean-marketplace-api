export class SuperfoodVariant {
	constructor(
		public id: string,
		public combination: Record<string, string>,  // e.g., { "opt_color": "rojo", "opt_size": "grande" }
		public price: number,
		public stock: number,
	) { }
}
