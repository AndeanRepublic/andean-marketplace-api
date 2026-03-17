import { BadRequestException, Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { ImageOptimizerRepository } from '../../app/datastore/ImageOptimizer.repo';
import { StorageRepository } from '../../app/datastore/Storage.repo';

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_LONGEST_EDGE = 1200;
const JPEG_QUALITY = 80;
const PNG_EFFORT = 8;
const WEBP_QUALITY = 80;

const SKIP_MIME_TYPES = new Set(['image/gif', 'image/svg+xml']);

// ─── Helpers ─────────────────────────────────────────────────────────────────

type SupportedFormat = 'jpeg' | 'png' | 'webp';

function mimeToFormat(mimeType: string): SupportedFormat {
	switch (mimeType) {
		case 'image/jpeg':
			return 'jpeg';
		case 'image/png':
			return 'png';
		case 'image/webp':
			return 'webp';
		default:
			return 'jpeg';
	}
}

function qualityOptions(
	format: SupportedFormat,
): sharp.JpegOptions | sharp.PngOptions | sharp.WebpOptions {
	switch (format) {
		case 'jpeg':
			return { quality: JPEG_QUALITY };
		case 'png':
			return { effort: PNG_EFFORT };
		case 'webp':
			return { quality: WEBP_QUALITY };
	}
}

// ─── Image Optimizer Implementation ──────────────────────────────────────────

@Injectable()
export class ImageOptimizerRepoImpl implements ImageOptimizerRepository {
	async optimize(file: Buffer, mimeType: string): Promise<Buffer> {
		if (!mimeType.startsWith('image/') || SKIP_MIME_TYPES.has(mimeType)) {
			return file;
		}

		const format = mimeToFormat(mimeType);
		const options = qualityOptions(format);

		try {
			const { data, info } = await sharp(file)
				.rotate()
				.resize({
					width: MAX_LONGEST_EDGE,
					height: MAX_LONGEST_EDGE,
					fit: 'inside',
					withoutEnlargement: true,
				})
				.toFormat(format, options)
				.toBuffer({ resolveWithObject: true });

			return this.applyGuard(file, data, info.size);
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : String(err);
			throw new BadRequestException(`Image optimization failed: ${message}`);
		}
	}

	/**
	 * Size-guard: if the optimized buffer is larger than or equal to the original,
	 * return the original to avoid inflating stored file size.
	 * Exposed as a method to allow deterministic unit testing of the guard logic.
	 */
	applyGuard(
		original: Buffer,
		optimized: Buffer,
		optimizedSize: number,
	): Buffer {
		return optimizedSize >= original.length ? original : optimized;
	}
}

// ─── Decorator / Adapter ─────────────────────────────────────────────────────

@Injectable()
export class OptimizedStorageRepoImpl implements StorageRepository {
	constructor(
		private readonly inner: StorageRepository,
		private readonly optimizer: ImageOptimizerRepository,
	) {}

	async uploadFile(
		file: Buffer,
		type: string,
		fileName: string,
		mimeType: string,
	): Promise<string> {
		const optimized = await this.optimizer.optimize(file, mimeType);
		return this.inner.uploadFile(optimized, type, fileName, mimeType);
	}

	async deleteFile(key: string): Promise<void> {
		return this.inner.deleteFile(key);
	}
}
