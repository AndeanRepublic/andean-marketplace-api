export type SuperfoodSizeUnit = 'g' | 'mg' | 'kg';

export class SizeOptionAlternative {
	constructor(
		public id: string,
		public nameLabel: string,
		public sizeNumber: number,
		public sizeUnit: SuperfoodSizeUnit,
		public servingsPerContainer: number,
	) {}
}
