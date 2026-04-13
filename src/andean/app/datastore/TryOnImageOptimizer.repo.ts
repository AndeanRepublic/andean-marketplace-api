/**
 * Optimized image result specifically for Try-On processing.
 * Always outputs WebP for maximum compression.
 */
export interface TryOnOptimizedImage {
	buffer: Buffer;
	mimeType: 'image/webp';
}

/**
 * Aggressive image optimizer specifically for Try-On use case.
 *
 * Key differences from generic ImageOptimizerRepository:
 * - Smaller max edge (768px vs 1200px) — Segmind doesn't need high resolution
 * - Always outputs WebP — best compression ratio
 * - Lower quality (75 vs 80) — faster upload and processing
 *
 * These optimizations can reduce a 5MB image to ~100-200KB,
 * significantly speeding up Segmind processing time.
 */
export abstract class TryOnImageOptimizerRepository {
	/**
	 * Optimize an image specifically for try-on processing.
	 * Always converts to WebP for maximum compression.
	 *
	 * @param file - Original image buffer
	 * @param mimeType - Original MIME type
	 * @returns Optimized image buffer and new mimeType (always webp)
	 */
	abstract optimize(
		file: Buffer,
		mimeType: string,
	): Promise<TryOnOptimizedImage>;
}
