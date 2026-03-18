import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import request from 'supertest';
import { MediaItemController } from '../src/andean/infra/controllers/mediaItem.controller';
import { UploadMediaItemUseCase } from '../src/andean/app/use_cases/media/UploadMediaItemUseCase';
import { GetMediaItemByIdUseCase } from '../src/andean/app/use_cases/media/GetMediaItemByIdUseCase';
import { ListMediaItemsUseCase } from '../src/andean/app/use_cases/media/ListMediaItemsUseCase';
import { UpdateMediaItemUseCase } from '../src/andean/app/use_cases/media/UpdateMediaItemUseCase';
import { DeleteMediaItemUseCase } from '../src/andean/app/use_cases/media/DeleteMediaItemUseCase';
import { MediaItemType } from '../src/andean/domain/enums/MediaItemType';
import { MediaItemRole } from '../src/andean/domain/enums/MediaItemRole';
import { FixtureLoader } from './helpers/fixture-loader';
import { JwtAuthGuard } from '../src/andean/infra/core/jwtAuth.guard';
import { RolesGuard } from '../src/andean/infra/core/roles.guard';
import { createAllowAllGuard, mockAuthUsers } from './helpers/auth-test.helper';

describe('MediaItemController (e2e)', () => {
	let app: INestApplication;
	let uploadMediaItemUseCase: UploadMediaItemUseCase;
	let getMediaItemByIdUseCase: GetMediaItemByIdUseCase;
	let listMediaItemsUseCase: ListMediaItemsUseCase;
	let updateMediaItemUseCase: UpdateMediaItemUseCase;
	let deleteMediaItemUseCase: DeleteMediaItemUseCase;

	// Load mock data from JSON fixture
	const fixture = FixtureLoader.loadMediaItem();
	const mockMediaItem = {
		...fixture.entity,
		createdAt: new Date(fixture.entity.createdAt),
		updatedAt: new Date(fixture.entity.updatedAt),
	} as any;
	const updateDto = fixture.updateDto;

	const storageBaseUrl = 'https://test-storage.example.com';

	// Minimal valid 1x1 pixel PNG for file upload tests
	const validPngBuffer = Buffer.from(
		'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
		'base64',
	);

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [MediaItemController],
			providers: [
				{
					provide: UploadMediaItemUseCase,
					useValue: { execute: jest.fn().mockResolvedValue(mockMediaItem) },
				},
				{
					provide: GetMediaItemByIdUseCase,
					useValue: { execute: jest.fn().mockResolvedValue(mockMediaItem) },
				},
				{
					provide: ListMediaItemsUseCase,
					useValue: { execute: jest.fn().mockResolvedValue([mockMediaItem]) },
				},
				{
					provide: UpdateMediaItemUseCase,
					useValue: { execute: jest.fn().mockResolvedValue(mockMediaItem) },
				},
				{
					provide: DeleteMediaItemUseCase,
					useValue: { execute: jest.fn().mockResolvedValue(undefined) },
				},
				{
					provide: ConfigService,
					useValue: { get: jest.fn().mockReturnValue(storageBaseUrl) },
				},
			],
		})
			.overrideGuard(JwtAuthGuard)
			.useValue(createAllowAllGuard(mockAuthUsers.seller))
			.overrideGuard(RolesGuard)
			.useValue({ canActivate: () => true })
			.compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
				forbidNonWhitelisted: true,
				transform: true,
			}),
		);
		await app.init();

		uploadMediaItemUseCase = moduleFixture.get(UploadMediaItemUseCase);
		getMediaItemByIdUseCase = moduleFixture.get(GetMediaItemByIdUseCase);
		listMediaItemsUseCase = moduleFixture.get(ListMediaItemsUseCase);
		updateMediaItemUseCase = moduleFixture.get(UpdateMediaItemUseCase);
		deleteMediaItemUseCase = moduleFixture.get(DeleteMediaItemUseCase);
	});

	afterAll(async () => {
		await app.close();
	});
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('POST /media-items (upload)', () => {
		it('should upload and create a new media item', () => {
			jest
				.spyOn(uploadMediaItemUseCase, 'execute')
				.mockResolvedValueOnce(mockMediaItem);
			return request(app.getHttpServer())
				.post('/media-items')
				.attach('file', validPngBuffer, {
					filename: 'icon-energy.png',
					contentType: 'image/png',
				})
				.field('type', MediaItemType.IMG)
				.field('name', 'icon-energy.png')
				.field('role', MediaItemRole.PRINCIPAL)
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: expect.any(String),
						type: expect.any(String),
						name: expect.any(String),
						url: expect.any(String),
					});
					expect(res.body).toHaveProperty('createdAt');
					expect(res.body).toHaveProperty('updatedAt');
				});
		});

		it('should return 400 when file is missing', () => {
			return request(app.getHttpServer())
				.post('/media-items')
				.field('type', MediaItemType.IMG)
				.field('name', 'icon.svg')
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when type is missing', () => {
			return request(app.getHttpServer())
				.post('/media-items')
				.attach('file', validPngBuffer, {
					filename: 'icon.png',
					contentType: 'image/png',
				})
				.field('name', 'icon.png')
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when name is missing', () => {
			return request(app.getHttpServer())
				.post('/media-items')
				.attach('file', validPngBuffer, {
					filename: 'icon.png',
					contentType: 'image/png',
				})
				.field('type', MediaItemType.IMG)
				.expect(HttpStatus.BAD_REQUEST);
		});
	});

	describe('GET /media-items/:id', () => {
		it('should return a media item by id', () => {
			jest
				.spyOn(getMediaItemByIdUseCase, 'execute')
				.mockResolvedValueOnce(mockMediaItem);
			return request(app.getHttpServer())
				.get(`/media-items/${mockMediaItem.id}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: mockMediaItem.id,
						type: mockMediaItem.type,
						name: mockMediaItem.name,
					});
				});
		});

		it('should return 500 when media item not found', () => {
			jest
				.spyOn(getMediaItemByIdUseCase, 'execute')
				.mockRejectedValueOnce(new Error('MediaItem not found'));
			return request(app.getHttpServer())
				.get('/media-items/non-existent-id')
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});

	describe.skip('GET /media-items', () => {
		it('should return all media items', () => {
			const items = [
				mockMediaItem,
				...fixture.additionalEntities.map((e) => ({ ...mockMediaItem, ...e })),
			];
			jest.spyOn(listMediaItemsUseCase, 'execute').mockResolvedValueOnce(items);
			return request(app.getHttpServer())
				.get('/media-items')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveLength(items.length);
					res.body.forEach((item) => {
						expect(item).toMatchObject({
							id: expect.any(String),
							name: expect.any(String),
						});
					});
				});
		});

		it('should return empty array when no media items exist', () => {
			jest.spyOn(listMediaItemsUseCase, 'execute').mockResolvedValueOnce([]);
			return request(app.getHttpServer())
				.get('/media-items')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toEqual([]);
				});
		});
	});

	describe.skip('PUT /media-items/:id', () => {
		it('should update a media item', () => {
			const updated = { ...mockMediaItem, name: updateDto.name };
			jest
				.spyOn(updateMediaItemUseCase, 'execute')
				.mockResolvedValueOnce(updated);
			return request(app.getHttpServer())
				.put(`/media-items/${mockMediaItem.id}`)
				.send(updateDto)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: mockMediaItem.id,
						name: updateDto.name,
					});
				});
		});

		it('should return 500 when trying to update non-existent media item', () => {
			jest
				.spyOn(updateMediaItemUseCase, 'execute')
				.mockRejectedValueOnce(new Error('MediaItem not found'));
			return request(app.getHttpServer())
				.put('/media-items/non-existent-id')
				.send(updateDto)
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});

	describe.skip('DELETE /media-items/:id', () => {
		it('should delete a media item', () => {
			jest
				.spyOn(deleteMediaItemUseCase, 'execute')
				.mockResolvedValueOnce(undefined);
			return request(app.getHttpServer())
				.delete(`/media-items/${mockMediaItem.id}`)
				.expect(HttpStatus.NO_CONTENT);
		});

		it('should return 500 when trying to delete non-existent media item', () => {
			jest
				.spyOn(deleteMediaItemUseCase, 'execute')
				.mockRejectedValueOnce(new Error('MediaItem not found'));
			return request(app.getHttpServer())
				.delete('/media-items/non-existent-id')
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});
});
