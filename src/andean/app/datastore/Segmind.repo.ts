export interface SegmindTryOnResult {
	image: string;
	mimeType: string;
}

export abstract class SegmindRepository {
	abstract tryOn(
		modelImageUrl: string,
		outfitImageUrl: string,
	): Promise<SegmindTryOnResult>;
}
