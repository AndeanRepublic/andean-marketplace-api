// Value Object — no tiene identidad propia, vive embebido en Experience
export class ExperienceMediaInfo {
	constructor(
		public landscapeImg: string,
		public thumbnailImg: string,
		public photos?: string[],
		public videos?: string[],
		public ubicationImg?: string,
	) { }
}
