export abstract class ImageOptimizerRepository {
	/**
	 * Optimize an image buffer before storage
	 * @param file - Original image buffer
	 * @param mimeType - MIME type of the image (e.g., 'image/jpeg', 'image/png', 'image/webp')
	 * @returns Optimized image buffer (or original if optimization would inflate size)
	 */
	abstract optimize(file: Buffer, mimeType: string): Promise<Buffer>;
}
