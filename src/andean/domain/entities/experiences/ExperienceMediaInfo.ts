export class ExperienceMediaInfo {
	constructor(
		public id: string,
		public landscapeImg: string,
		public thumbnailImg: string,
		public photos?: string[],
		public videos?: string[],
	) { }
}
