export class CommunityPageInfo {
	constructor(
		public id: string,
		public tagline: string,
		public shortBio: string,
		public familyCount: number,
		public weaverCount: number,
		public activityYears: number,
		public infoImageMediaIds: string[],
		public whatWeDoDescription: string,
		public whatWeDoImageMediaIds: string[],
		public galleryPhotoMediaIds: string[],
		public galleryVideoMediaId?: string,
		public galleryVideoPosterMediaId?: string,
	) {}
}
