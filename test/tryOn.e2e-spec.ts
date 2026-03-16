import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TryOnController } from '../src/andean/infra/controllers/tryOn.controller';
import { JwtAuthGuard } from '../src/andean/infra/core/jwtAuth.guard';
import {
	createAllowAllGuard,
	createDenyAllGuard,
	mockAuthUsers,
} from './helpers/auth-test.helper';
import { TryOnUseCase } from '../src/andean/app/use_cases/tryOn/TryOnUseCase';

describe('TryOnController (e2e) — Pattern B authentication', () => {
	// Minimal valid 1x1 pixel PNG for file upload tests
	const validPngBuffer = Buffer.from(
		'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
		'base64',
	);

	const mockTryOnResult = {
		image: 'base64encodedresult',
		mimeType: 'image/jpeg',
	};

	// ─── Helper to build app with a given auth user ─────────────────────────────
	async function buildApp(
		authUser: { userId: string; email: string; roles: any[] } | null,
	): Promise<INestApplication> {
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
		})
			.overrideGuard(JwtAuthGuard)
			.useValue(authUser ? createAllowAllGuard(authUser) : createDenyAllGuard())
			.compile();

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
		it('should return 201 when authenticated USER submits try-on', async () => {
			const app = await buildApp(mockAuthUsers.customer);
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

		it('should return 201 when authenticated SELLER submits try-on', async () => {
			const app = await buildApp(mockAuthUsers.seller);
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

		it('should return 401 when no token is provided', async () => {
			const app = await buildApp(null);

			await request(app.getHttpServer())
				.post('/try-on')
				.attach('file', validPngBuffer, {
					filename: 'person.png',
					contentType: 'image/png',
				})
				.field('textileProductId', 'textile-product-uuid-001')
				.expect(HttpStatus.UNAUTHORIZED);

			await app.close();
		});
	});
});
