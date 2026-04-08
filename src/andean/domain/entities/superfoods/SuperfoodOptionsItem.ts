export class SuperfoodOptionsItem {
	constructor(
		public label: string,
		public mediaIds?: string[], // IDs referencing MediaItem collection
		public idOptionAlternative?: string,
	) {}
}
