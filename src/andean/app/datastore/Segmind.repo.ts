export abstract class SegmindRepository {
	abstract tryOn(
		humanImageBase64: string,
		garmentImageUrl: string,
		garmentDescription: string,
	): Promise<string>; // retorna imagen resultante en base64
}
