export class SuperfoodOptionsItem {
	constructor(
		public label: string,
		public mediaIds?: string[], // IDs referencing MediaItem collection
		public idOptionAlternative?: string,
		public sizeNumber?: number,
		public sizeUnit?: 'g' | 'mg' | 'kg',
		public servingsPerContainer?: number,
		public price?: number,
		public stock?: number,
		public sku?: string,
	) {}
}
