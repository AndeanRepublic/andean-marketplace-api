import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TryOnController } from '../src/andean/infra/controllers/tryOn.controller';
import { TryOnUseCase } from '../src/andean/app/use_cases/tryOn/TryOnUseCase';

describe('TryOnController (e2e)', () => {
	// Minimal valid 1x1 pixel PNG for file upload tests
	const validPngBuffer = Buffer.from(
		'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
		'base64',
	);

	const mockTryOnResult = {
		image: 'base64encodedresult',
		mimeType: 'image/jpeg',
	};

	// ─── Helper to build app without auth ─────────────────────────────────────────
	async function buildApp(): Promise<INestApplication> {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [TryOnController],
			providers: [
				{
					provide: TryOnUseCase,
					useValue: {
						execute: jest.fn().mockResolvedValue(mockTryOnResult),
					},
				},
			],
		}).compile();

		const app = module.createNestApplication();
		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
				forbidNonWhitelisted: true,
				transform: true,
			}),
		);
		await app.init();
		return app;
	}

	// ─── POST /try-on ────────────────────────────────────────────────────────────
	describe('POST /try-on', () => {
		it('should return 201 when submitting try-on without auth', async () => {
			const app = await buildApp();
			const uc = app.get(TryOnUseCase);
			jest.spyOn(uc, 'execute').mockResolvedValueOnce(mockTryOnResult);

			await request(app.getHttpServer())
				.post('/try-on')
				.attach('file', validPngBuffer, {
					filename: 'person.png',
					contentType: 'image/png',
				})
				.field('textileProductId', 'textile-product-uuid-001')
				.expect((res) => {
					expect([HttpStatus.OK, HttpStatus.CREATED]).toContain(res.status);
				});

			await app.close();
		});
	});
});
