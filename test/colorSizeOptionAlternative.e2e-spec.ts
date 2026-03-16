import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ColorOptionAlternativeController } from '../src/andean/infra/controllers/colorOptionAlternative.controller';
import { SizeOptionAlternativeController } from '../src/andean/infra/controllers/sizeOptionAlternative.controller';
import { JwtAuthGuard } from '../src/andean/infra/core/jwtAuth.guard';
import { RolesGuard } from '../src/andean/infra/core/roles.guard';
import {
	createAllowAllGuard,
	createDenyAllGuard,
	mockAuthUsers,
} from './helpers/auth-test.helper';
import { CreateColorOptionAlternativeUseCase } from '../src/andean/app/use_cases/textileProducts/CreateColorOptionAlternativeUseCase';
import { CreateManyColorOptionAlternativesUseCase } from '../src/andean/app/use_cases/textileProducts/CreateManyColorOptionAlternativesUseCase';
import { GetAllColorOptionAlternativesUseCase } from '../src/andean/app/use_cases/textileProducts/GetAllColorOptionAlternativesUseCase';
import { GetByIdColorOptionAlternativeUseCase } from '../src/andean/app/use_cases/textileProducts/GetByIdColorOptionAlternativeUseCase';
import { UpdateColorOptionAlternativeUseCase } from '../src/andean/app/use_cases/textileProducts/UpdateColorOptionAlternativeUseCase';
import { DeleteColorOptionAlternativeUseCase } from '../src/andean/app/use_cases/textileProducts/DeleteColorOptionAlternativeUseCase';
import { CreateSizeOptionAlternativeUseCase } from '../src/andean/app/use_cases/textileProducts/CreateSizeOptionAlternativeUseCase';
import { CreateManySizeOptionAlternativesUseCase } from '../src/andean/app/use_cases/textileProducts/CreateManySizeOptionAlternativesUseCase';
import { GetAllSizeOptionAlternativesUseCase } from '../src/andean/app/use_cases/textileProducts/GetAllSizeOptionAlternativesUseCase';
import { GetByIdSizeOptionAlternativeUseCase } from '../src/andean/app/use_cases/textileProducts/GetByIdSizeOptionAlternativeUseCase';
import { UpdateSizeOptionAlternativeUseCase } from '../src/andean/app/use_cases/textileProducts/UpdateSizeOptionAlternativeUseCase';
import { DeleteSizeOptionAlternativeUseCase } from '../src/andean/app/use_cases/textileProducts/DeleteSizeOptionAlternativeUseCase';

const mockColorOptionAlternative = {
	id: 'color-uuid-001',
	nameLabel: 'Rojo Carmesí',
	hexCode: '#C41E3A',
};

const mockSizeOptionAlternative = {
	id: 'size-uuid-001',
	nameLabel: 'M',
};

const validColorBody = { nameLabel: 'Rojo Carmesí', hexCode: '#C41E3A' };
const validColorBulkBody = {
	colorOptionAlternatives: [{ nameLabel: 'Rojo Carmesí', hexCode: '#C41E3A' }],
};
const validSizeBody = { nameLabel: 'M' };
const validSizeBulkBody = {
	sizeOptionAlternatives: [{ nameLabel: 'M' }],
};

async function buildApp(
	jwtGuard: object,
	rolesGuard: object,
): Promise<INestApplication> {
	const module: TestingModule = await Test.createTestingModule({
		controllers: [
			ColorOptionAlternativeController,
			SizeOptionAlternativeController,
		],
		providers: [
			// ── Color write use cases ──────────────────────────────────────
			{
				provide: CreateColorOptionAlternativeUseCase,
				useValue: {
					handle: jest.fn().mockResolvedValue(mockColorOptionAlternative),
				},
			},
			{
				provide: CreateManyColorOptionAlternativesUseCase,
				useValue: {
					handle: jest.fn().mockResolvedValue([mockColorOptionAlternative]),
				},
			},
			// ── Color read / write use cases (DI resolution) ──────────────
			{
				provide: GetAllColorOptionAlternativesUseCase,
				useValue: {
					handle: jest.fn().mockResolvedValue([mockColorOptionAlternative]),
				},
			},
			{
				provide: GetByIdColorOptionAlternativeUseCase,
				useValue: {
					handle: jest.fn().mockResolvedValue(mockColorOptionAlternative),
				},
			},
			{
				provide: UpdateColorOptionAlternativeUseCase,
				useValue: {
					handle: jest.fn().mockResolvedValue(mockColorOptionAlternative),
				},
			},
			{
				provide: DeleteColorOptionAlternativeUseCase,
				useValue: { handle: jest.fn().mockResolvedValue(undefined) },
			},
			// ── Size write use cases ───────────────────────────────────────
			{
				provide: CreateSizeOptionAlternativeUseCase,
				useValue: {
					handle: jest.fn().mockResolvedValue(mockSizeOptionAlternative),
				},
			},
			{
				provide: CreateManySizeOptionAlternativesUseCase,
				useValue: {
					handle: jest.fn().mockResolvedValue([mockSizeOptionAlternative]),
				},
			},
			// ── Size read / write use cases (DI resolution) ───────────────
			{
				provide: GetAllSizeOptionAlternativesUseCase,
				useValue: {
					handle: jest.fn().mockResolvedValue([mockSizeOptionAlternative]),
				},
			},
			{
				provide: GetByIdSizeOptionAlternativeUseCase,
				useValue: {
					handle: jest.fn().mockResolvedValue(mockSizeOptionAlternative),
				},
			},
			{
				provide: UpdateSizeOptionAlternativeUseCase,
				useValue: {
					handle: jest.fn().mockResolvedValue(mockSizeOptionAlternative),
				},
			},
			{
				provide: DeleteSizeOptionAlternativeUseCase,
				useValue: { handle: jest.fn().mockResolvedValue(undefined) },
			},
		],
	})
		.overrideGuard(JwtAuthGuard)
		.useValue(jwtGuard)
		.overrideGuard(RolesGuard)
		.useValue(rolesGuard)
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

describe('ColorOptionAlternativeController & SizeOptionAlternativeController (e2e) — Auth', () => {
	// ── POST /textile-products/color-option-alternatives ──────────────
	describe('POST /textile-products/color-option-alternatives', () => {
		it('should return 401 when no token is provided', async () => {
			const app = await buildApp(createDenyAllGuard(), {
				canActivate: () => true,
			});

			await request(app.getHttpServer())
				.post('/textile-products/color-option-alternatives')
				.send(validColorBody)
				.expect(HttpStatus.UNAUTHORIZED);

			await app.close();
		});

		it('should return 403 when USER role makes the request', async () => {
			const app = await buildApp(createAllowAllGuard(mockAuthUsers.customer), {
				canActivate: () => false,
			});

			await request(app.getHttpServer())
				.post('/textile-products/color-option-alternatives')
				.send(validColorBody)
				.expect(HttpStatus.FORBIDDEN);

			await app.close();
		});

		it('should return 201 when SELLER creates a color option alternative', async () => {
			const app = await buildApp(createAllowAllGuard(mockAuthUsers.seller), {
				canActivate: () => true,
			});

			await request(app.getHttpServer())
				.post('/textile-products/color-option-alternatives')
				.send(validColorBody)
				.expect(HttpStatus.CREATED);

			await app.close();
		});

		it('should return 201 when ADMIN creates a color option alternative', async () => {
			const app = await buildApp(createAllowAllGuard(mockAuthUsers.admin), {
				canActivate: () => true,
			});

			await request(app.getHttpServer())
				.post('/textile-products/color-option-alternatives')
				.send(validColorBody)
				.expect(HttpStatus.CREATED);

			await app.close();
		});
	});

	// ── POST /textile-products/color-option-alternatives/bulk ─────────
	describe('POST /textile-products/color-option-alternatives/bulk', () => {
		it('should return 401 when no token is provided', async () => {
			const app = await buildApp(createDenyAllGuard(), {
				canActivate: () => true,
			});

			await request(app.getHttpServer())
				.post('/textile-products/color-option-alternatives/bulk')
				.send(validColorBulkBody)
				.expect(HttpStatus.UNAUTHORIZED);

			await app.close();
		});

		it('should return 403 when USER role makes the request', async () => {
			const app = await buildApp(createAllowAllGuard(mockAuthUsers.customer), {
				canActivate: () => false,
			});

			await request(app.getHttpServer())
				.post('/textile-products/color-option-alternatives/bulk')
				.send(validColorBulkBody)
				.expect(HttpStatus.FORBIDDEN);

			await app.close();
		});

		it('should return 201 when SELLER creates color option alternatives in bulk', async () => {
			const app = await buildApp(createAllowAllGuard(mockAuthUsers.seller), {
				canActivate: () => true,
			});

			await request(app.getHttpServer())
				.post('/textile-products/color-option-alternatives/bulk')
				.send(validColorBulkBody)
				.expect(HttpStatus.CREATED);

			await app.close();
		});

		it('should return 201 when ADMIN creates color option alternatives in bulk', async () => {
			const app = await buildApp(createAllowAllGuard(mockAuthUsers.admin), {
				canActivate: () => true,
			});

			await request(app.getHttpServer())
				.post('/textile-products/color-option-alternatives/bulk')
				.send(validColorBulkBody)
				.expect(HttpStatus.CREATED);

			await app.close();
		});
	});

	// ── POST /textile-products/size-option-alternatives ───────────────
	describe('POST /textile-products/size-option-alternatives', () => {
		it('should return 401 when no token is provided', async () => {
			const app = await buildApp(createDenyAllGuard(), {
				canActivate: () => true,
			});

			await request(app.getHttpServer())
				.post('/textile-products/size-option-alternatives')
				.send(validSizeBody)
				.expect(HttpStatus.UNAUTHORIZED);

			await app.close();
		});

		it('should return 403 when USER role makes the request', async () => {
			const app = await buildApp(createAllowAllGuard(mockAuthUsers.customer), {
				canActivate: () => false,
			});

			await request(app.getHttpServer())
				.post('/textile-products/size-option-alternatives')
				.send(validSizeBody)
				.expect(HttpStatus.FORBIDDEN);

			await app.close();
		});

		it('should return 201 when SELLER creates a size option alternative', async () => {
			const app = await buildApp(createAllowAllGuard(mockAuthUsers.seller), {
				canActivate: () => true,
			});

			await request(app.getHttpServer())
				.post('/textile-products/size-option-alternatives')
				.send(validSizeBody)
				.expect(HttpStatus.CREATED);

			await app.close();
		});

		it('should return 201 when ADMIN creates a size option alternative', async () => {
			const app = await buildApp(createAllowAllGuard(mockAuthUsers.admin), {
				canActivate: () => true,
			});

			await request(app.getHttpServer())
				.post('/textile-products/size-option-alternatives')
				.send(validSizeBody)
				.expect(HttpStatus.CREATED);

			await app.close();
		});
	});

	// ── POST /textile-products/size-option-alternatives/bulk ──────────
	describe('POST /textile-products/size-option-alternatives/bulk', () => {
		it('should return 401 when no token is provided', async () => {
			const app = await buildApp(createDenyAllGuard(), {
				canActivate: () => true,
			});

			await request(app.getHttpServer())
				.post('/textile-products/size-option-alternatives/bulk')
				.send(validSizeBulkBody)
				.expect(HttpStatus.UNAUTHORIZED);

			await app.close();
		});

		it('should return 403 when USER role makes the request', async () => {
			const app = await buildApp(createAllowAllGuard(mockAuthUsers.customer), {
				canActivate: () => false,
			});

			await request(app.getHttpServer())
				.post('/textile-products/size-option-alternatives/bulk')
				.send(validSizeBulkBody)
				.expect(HttpStatus.FORBIDDEN);

			await app.close();
		});

		it('should return 201 when SELLER creates size option alternatives in bulk', async () => {
			const app = await buildApp(createAllowAllGuard(mockAuthUsers.seller), {
				canActivate: () => true,
			});

			await request(app.getHttpServer())
				.post('/textile-products/size-option-alternatives/bulk')
				.send(validSizeBulkBody)
				.expect(HttpStatus.CREATED);

			await app.close();
		});

		it('should return 201 when ADMIN creates size option alternatives in bulk', async () => {
			const app = await buildApp(createAllowAllGuard(mockAuthUsers.admin), {
				canActivate: () => true,
			});

			await request(app.getHttpServer())
				.post('/textile-products/size-option-alternatives/bulk')
				.send(validSizeBulkBody)
				.expect(HttpStatus.CREATED);

			await app.close();
		});
	});
});
