import { BadRequestException } from '@nestjs/common';
import sharp from 'sharp';
import { ImageOptimizerRepository } from '../../app/datastore/ImageOptimizer.repo';
import { StorageRepository } from '../../app/datastore/Storage.repo';
import {
	ImageOptimizerRepoImpl,
	OptimizedStorageRepoImpl,
} from './OptimizedStorage.repo.impl';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Generate a real in-memory image buffer using sharp's `create` API.
 * No external fixture files needed.
 */
async function createTestImage(
	width: number,
	height: number,
	format: 'jpeg' | 'png' | 'webp' = 'jpeg',
): Promise<Buffer> {
	const channels = format === 'jpeg' ? 3 : 4;
	return sharp({
		create: {
			width,
			height,
			channels,
			background:
				format === 'jpeg'
					? { r: 100, g: 149, b: 237 }
					: { r: 100, g: 149, b: 237, alpha: 1 },
		},
	})
		.toFormat(format)
		.toBuffer();
}

// ─── ImageOptimizerRepoImpl ───────────────────────────────────────────────────

describe('ImageOptimizerRepoImpl', () => {
	let optimizer: ImageOptimizerRepoImpl;

	beforeEach(() => {
		optimizer = new ImageOptimizerRepoImpl();
	});

	// ── SKIP-NON-IMAGE ────────────────────────────────────────────────────────

	describe('SKIP-NON-IMAGE', () => {
		it('4.2 video/mp4 → returns original buffer unchanged', async () => {
			const buf = Buffer.from('fake-video-bytes');
			const result = await optimizer.optimize(buf, 'video/mp4');
			expect(result).toBe(buf);
		});

		it('4.3 image/svg+xml → returns original buffer unchanged', async () => {
			const buf = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>');
			const result = await optimizer.optimize(buf, 'image/svg+xml');
			expect(result).toBe(buf);
		});

		it('4.4 image/gif → returns original buffer unchanged', async () => {
			const buf = Buffer.from('GIF89a fake gif bytes');
			const result = await optimizer.optimize(buf, 'image/gif');
			expect(result).toBe(buf);
		});
	});

	// ── RESIZE-LONGEST-EDGE ───────────────────────────────────────────────────

	describe('RESIZE-LONGEST-EDGE', () => {
		it('4.5 large 2400×1600 JPEG → output longest edge ≤ 1200', async () => {
			const largeBuffer = await createTestImage(2400, 1600, 'jpeg');
			const result = await optimizer.optimize(largeBuffer, 'image/jpeg');
			const metadata = await sharp(result).metadata();
			expect(metadata.width).toBeLessThanOrEqual(1200);
			expect(metadata.height).toBeLessThanOrEqual(1200);
		});

		it('4.6 small 100×80 JPEG → dimensions must not be enlarged', async () => {
			const smallBuffer = await createTestImage(100, 80, 'jpeg');
			const result = await optimizer.optimize(smallBuffer, 'image/jpeg');
			const metadata = await sharp(result).metadata();
			expect(metadata.width).toBeLessThanOrEqual(100);
			expect(metadata.height).toBeLessThanOrEqual(80);
		});
	});

	// ── FORMAT-QUALITY ────────────────────────────────────────────────────────

	describe('FORMAT-QUALITY', () => {
		it('4.7 image/jpeg → output format is jpeg', async () => {
			const buf = await createTestImage(300, 200, 'jpeg');
			const result = await optimizer.optimize(buf, 'image/jpeg');
			const metadata = await sharp(result).metadata();
			expect(metadata.format).toBe('jpeg');
		});

		it('4.8 image/png → output format is png', async () => {
			const buf = await createTestImage(300, 200, 'png');
			const result = await optimizer.optimize(buf, 'image/png');
			const metadata = await sharp(result).metadata();
			expect(metadata.format).toBe('png');
		});

		it('4.9 image/webp → output format is webp', async () => {
			const buf = await createTestImage(300, 200, 'webp');
			const result = await optimizer.optimize(buf, 'image/webp');
			const metadata = await sharp(result).metadata();
			expect(metadata.format).toBe('webp');
		});
	});

	// ── SIZE-GUARD ────────────────────────────────────────────────────────────

	describe('SIZE-GUARD', () => {
		it('4.10a applyGuard returns original when optimized >= original size', () => {
			const original = Buffer.alloc(100, 0xaa);
			const optimized = Buffer.alloc(120, 0xbb); // larger

			const result = optimizer.applyGuard(
				original,
				optimized,
				optimized.length,
			);

			expect(result).toBe(original); // strict reference equality
		});

		it('4.10b applyGuard returns original when optimized === original size (boundary)', () => {
			const original = Buffer.alloc(100, 0xaa);
			const optimized = Buffer.alloc(100, 0xbb); // equal size

			const result = optimizer.applyGuard(
				original,
				optimized,
				optimized.length,
			);

			expect(result).toBe(original);
		});

		it('4.10c applyGuard returns optimized when optimized < original size', () => {
			const original = Buffer.alloc(100, 0xaa);
			const optimized = Buffer.alloc(60, 0xbb); // smaller — real optimization

			const result = optimizer.applyGuard(
				original,
				optimized,
				optimized.length,
			);

			expect(result).toBe(optimized); // strict reference equality
		});

		it('4.10d optimize() end-to-end never returns a buffer larger than the original', async () => {
			const tinyBuffer = await createTestImage(1, 1, 'jpeg');
			const result = await optimizer.optimize(tinyBuffer, 'image/jpeg');

			expect(Buffer.isBuffer(result)).toBe(true);
			expect(result.length).toBeLessThanOrEqual(tinyBuffer.length);
		});
	});

	// ── FORMAT-QUALITY / exotic fallback ─────────────────────────────────────

	describe('FORMAT-QUALITY (exotic mimeType)', () => {
		it('4.9b image/heic → falls back to jpeg format (libheif available in runtime)', async () => {
			// sharp 0.34.x ships with libheif — HEIC decode is supported.
			// The mimeToFormat() fallback maps unknown image/* types to 'jpeg'.
			// We verify that an exotic mimeType does not throw and produces a valid buffer.
			const jpegBuffer = await createTestImage(100, 100, 'jpeg');

			// Use image/heic as mimeType — mimeToFormat will map it to 'jpeg' (default branch)
			const result = await optimizer.optimize(jpegBuffer, 'image/heic');

			expect(Buffer.isBuffer(result)).toBe(true);
			expect(result.length).toBeGreaterThan(0);
			// Output should be jpeg since mimeToFormat falls back to 'jpeg'
			const metadata = await sharp(result).metadata();
			expect(metadata.format).toBe('jpeg');
		});
	});

	// ── FAIL-HARD-ON-ERROR ────────────────────────────────────────────────────

	describe('FAIL-HARD-ON-ERROR', () => {
		it('4.11 corrupt buffer → throws BadRequestException starting with "Image optimization failed"', async () => {
			const corruptBuffer = Buffer.from('not-an-image');

			await expect(
				optimizer.optimize(corruptBuffer, 'image/jpeg'),
			).rejects.toThrow(BadRequestException);

			await expect(
				optimizer.optimize(corruptBuffer, 'image/jpeg'),
			).rejects.toThrow(/^Image optimization failed/);
		});
	});
});

// ─── OptimizedStorageRepoImpl ─────────────────────────────────────────────────

describe('OptimizedStorageRepoImpl', () => {
	let mockInner: jest.Mocked<StorageRepository>;
	let mockOptimizer: jest.Mocked<ImageOptimizerRepository>;
	let service: OptimizedStorageRepoImpl;

	beforeEach(() => {
		mockInner = {
			uploadFile: jest.fn().mockResolvedValue('products/uuid-name.jpg'),
			deleteFile: jest.fn().mockResolvedValue(undefined),
		} as unknown as jest.Mocked<StorageRepository>;

		mockOptimizer = {
			optimize: jest
				.fn()
				.mockImplementation((buf: Buffer) => Promise.resolve(buf)),
		} as unknown as jest.Mocked<ImageOptimizerRepository>;

		service = new OptimizedStorageRepoImpl(mockInner, mockOptimizer);
	});

	// ── TRANSPARENT-KEY-CONTRACT ──────────────────────────────────────────────

	describe('TRANSPARENT-KEY-CONTRACT', () => {
		it('4.12a uploadFile delegates to optimizer then inner, returns inner key', async () => {
			const buf = Buffer.from('some-image-bytes');
			const optimizedBuf = Buffer.from('optimized-bytes');
			mockOptimizer.optimize.mockResolvedValue(optimizedBuf);

			const result = await service.uploadFile(
				buf,
				'products',
				'photo.jpg',
				'image/jpeg',
			);

			expect(mockOptimizer.optimize).toHaveBeenCalledWith(buf, 'image/jpeg');
			expect(mockInner.uploadFile).toHaveBeenCalledWith(
				optimizedBuf,
				'products',
				'photo.jpg',
				'image/jpeg',
			);
			expect(result).toBe('products/uuid-name.jpg');
		});

		it('4.12b deleteFile delegates to inner.deleteFile with the exact same key', async () => {
			const key = 'products/uuid-name.jpg';
			await service.deleteFile(key);
			expect(mockInner.deleteFile).toHaveBeenCalledWith(key);
			expect(mockInner.deleteFile).toHaveBeenCalledTimes(1);
		});
	});

	// ── DI CONTRACT ───────────────────────────────────────────────────────────

	describe('DI-CONTRACT', () => {
		it('optimizer.optimize is called before inner.uploadFile', async () => {
			const callOrder: string[] = [];
			mockOptimizer.optimize.mockImplementation(async (buf) => {
				callOrder.push('optimizer');
				return buf;
			});
			mockInner.uploadFile.mockImplementation(async () => {
				callOrder.push('inner');
				return 'key';
			});

			await service.uploadFile(
				Buffer.from('img'),
				'products',
				'photo.jpg',
				'image/jpeg',
			);

			expect(callOrder).toEqual(['optimizer', 'inner']);
		});
	});
});
