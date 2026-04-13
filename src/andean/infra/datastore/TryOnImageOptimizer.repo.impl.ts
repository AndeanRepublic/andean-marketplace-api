import { BadRequestException, Injectable } from '@nestjs/common';
import sharp from 'sharp';
import {
	TryOnImageOptimizerRepository,
	TryOnOptimizedImage,
} from '../../app/datastore/TryOnImageOptimizer.repo';

const TRYON_MAX_EDGE = 768;
const TRYON_WEBP_QUALITY = 75;

const SKIP_MIME_TYPES = new Set(['image/gif', 'image/svg+xml']);

@Injectable()
export class TryOnImageOptimizerRepoImpl implements TryOnImageOptimizerRepository {
	async optimize(file: Buffer, mimeType: string): Promise<TryOnOptimizedImage> {
		// Skip non-images or unsupported formats
		if (!mimeType.startsWith('image/') || SKIP_MIME_TYPES.has(mimeType)) {
			return { buffer: file, mimeType: 'image/webp' };
		}

		try {
			const optimized = await sharp(file)
				.rotate() // Auto-rotate based on EXIF
				.resize({
					width: TRYON_MAX_EDGE,
					height: TRYON_MAX_EDGE,
					fit: 'inside',
					withoutEnlargement: true,
				})
				.webp({ quality: TRYON_WEBP_QUALITY })
				.toBuffer();

			return {
				buffer: optimized,
				mimeType: 'image/webp',
			};
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : String(err);
			throw new BadRequestException(
				`Try-on image optimization failed: ${message}`,
			);
		}
	}
}
