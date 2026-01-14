export class SuperfoodOptionsItem {
	constructor(
		public id: string,
		public label: string,
		public mediaIds?: string[],  // IDs referencing MediaItem collection
	) { }
}
