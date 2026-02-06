import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { MediaItemController } from '../src/andean/infra/controllers/mediaItem.controller';
import { CreateMediaItemUseCase } from '../src/andean/app/use_cases/media/CreateMediaItemUseCase';
import { GetMediaItemByIdUseCase } from '../src/andean/app/use_cases/media/GetMediaItemByIdUseCase';
import { ListMediaItemsUseCase } from '../src/andean/app/use_cases/media/ListMediaItemsUseCase';
import { UpdateMediaItemUseCase } from '../src/andean/app/use_cases/media/UpdateMediaItemUseCase';
import { DeleteMediaItemUseCase } from '../src/andean/app/use_cases/media/DeleteMediaItemUseCase';
import { MediaItemResponse } from '../src/andean/app/modules/MediaItemResponse';
import { MediaItemType } from '../src/andean/domain/enums/MediaItemType';
import { MediaItemRole } from '../src/andean/domain/enums/MediaItemRole';

describe('MediaItemController (e2e)', () => {
	let app: INestApplication;
	let createMediaItemUseCase: CreateMediaItemUseCase;
	let getMediaItemByIdUseCase: GetMediaItemByIdUseCase;
	let listMediaItemsUseCase: ListMediaItemsUseCase;
	let updateMediaItemUseCase: UpdateMediaItemUseCase;
	let deleteMediaItemUseCase: DeleteMediaItemUseCase;

	// Mock data
	const mockMediaItemResponse: MediaItemResponse = {
		id: '123e4567-e89b-12d3-a456-426614174000',
		type: MediaItemType.IMG,
		name: 'icon-protein.svg',
		url: 'https://example.com/uploads/icon-protein.svg',
		role: MediaItemRole.NONE,
		createdAt: new Date('2026-01-01'),
		updatedAt: new Date('2026-01-01'),
	};

	const createDto = {
		type: MediaItemType.IMG,
		name: 'icon-energy.svg',
		url: 'https://example.com/uploads/icon-energy.svg',
		role: MediaItemRole.PRINCIPAL,
	};

	const updateDto = {
		name: 'icon-energy-updated.svg',
	};

	beforeAll(async () => {
		// Create testing module without database dependencies
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [MediaItemController],
			providers: [
				{
					provide: CreateMediaItemUseCase,
					useValue: {
						execute: jest.fn().mockResolvedValue(mockMediaItemResponse),
					},
				},
				{
					provide: GetMediaItemByIdUseCase,
					useValue: {
						execute: jest.fn().mockResolvedValue(mockMediaItemResponse),
					},
				},
				{
					provide: ListMediaItemsUseCase,
					useValue: {
						execute: jest.fn().mockResolvedValue([mockMediaItemResponse]),
					},
				},
				{
					provide: UpdateMediaItemUseCase,
					useValue: {
						execute: jest.fn().mockResolvedValue(mockMediaItemResponse),
					},
				},
				{
					provide: DeleteMediaItemUseCase,
					useValue: {
						execute: jest.fn().mockResolvedValue(undefined),
					},
				},
			],
		}).compile();

		app = moduleFixture.createNestApplication();

		// Apply global pipes for validation (like in main.ts)
		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
				forbidNonWhitelisted: true,
				transform: true,
			}),
		);

		await app.init();

		createMediaItemUseCase = moduleFixture.get<CreateMediaItemUseCase>(CreateMediaItemUseCase);
		getMediaItemByIdUseCase = moduleFixture.get<GetMediaItemByIdUseCase>(GetMediaItemByIdUseCase);
		listMediaItemsUseCase = moduleFixture.get<ListMediaItemsUseCase>(ListMediaItemsUseCase);
		updateMediaItemUseCase = moduleFixture.get<UpdateMediaItemUseCase>(UpdateMediaItemUseCase);
		deleteMediaItemUseCase = moduleFixture.get<DeleteMediaItemUseCase>(DeleteMediaItemUseCase);
	});

	afterAll(async () => {
		await app.close();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('POST /media-items', () => {
		it('should create a new media item', () => {
			jest.spyOn(createMediaItemUseCase, 'execute').mockResolvedValueOnce(mockMediaItemResponse);

			return request(app.getHttpServer())
				.post('/media-items')
				.send(createDto)
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toHaveProperty('id');
					expect(res.body).toHaveProperty('type');
					expect(res.body).toHaveProperty('name');
					expect(res.body).toHaveProperty('url');
					expect(res.body).toHaveProperty('role');
					expect(res.body).toHaveProperty('createdAt');
					expect(res.body).toHaveProperty('updatedAt');
				});
		});

		it('should return 400 when type is missing', () => {
			return request(app.getHttpServer())
				.post('/media-items')
				.send({ name: 'icon.svg', url: 'https://example.com/icon.svg', role: MediaItemRole.NONE })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when name is missing', () => {
			return request(app.getHttpServer())
				.post('/media-items')
				.send({ type: MediaItemType.IMG, url: 'https://example.com/icon.svg', role: MediaItemRole.NONE })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when url is missing', () => {
			return request(app.getHttpServer())
				.post('/media-items')
				.send({ type: MediaItemType.IMG, name: 'icon.svg', role: MediaItemRole.NONE })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when url is not valid', () => {
			return request(app.getHttpServer())
				.post('/media-items')
				.send({ type: MediaItemType.IMG, name: 'icon.svg', url: 'not-a-url', role: MediaItemRole.NONE })
				.expect(HttpStatus.BAD_REQUEST);
		});
	});

	describe('GET /media-items/:id', () => {
		it('should return a media item by id', () => {
			jest.spyOn(getMediaItemByIdUseCase, 'execute').mockResolvedValueOnce(mockMediaItemResponse);

			return request(app.getHttpServer())
				.get(`/media-items/${mockMediaItemResponse.id}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveProperty('id', mockMediaItemResponse.id);
					expect(res.body).toHaveProperty('type', mockMediaItemResponse.type);
					expect(res.body).toHaveProperty('name', mockMediaItemResponse.name);
					expect(res.body).toHaveProperty('url', mockMediaItemResponse.url);
					expect(res.body).toHaveProperty('createdAt');
					expect(res.body).toHaveProperty('updatedAt');
				});
		});

		it('should return 404 when media item not found', () => {
			const error = { statusCode: 404, message: 'MediaItem with id non-existent-id not found' };
			jest.spyOn(getMediaItemByIdUseCase, 'execute').mockRejectedValueOnce(error);

			return request(app.getHttpServer())
				.get('/media-items/non-existent-id')
				.expect(HttpStatus.NOT_FOUND);
		});
	});

	describe('GET /media-items', () => {
		it('should return all media items', () => {
			const mockMediaItems = [
				mockMediaItemResponse,
				{
					...mockMediaItemResponse,
					id: '223e4567-e89b-12d3-a456-426614174001',
					name: 'icon-fiber.svg',
				},
			];
			jest.spyOn(listMediaItemsUseCase, 'execute').mockResolvedValueOnce(mockMediaItems);

			return request(app.getHttpServer())
				.get('/media-items')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(Array.isArray(res.body)).toBe(true);
					expect(res.body).toHaveLength(2);
					expect(res.body[0]).toHaveProperty('id');
					expect(res.body[0]).toHaveProperty('type');
					expect(res.body[0]).toHaveProperty('name');
					expect(res.body[1]).toHaveProperty('id');
					expect(res.body[1]).toHaveProperty('name');
				});
		});

		it('should return empty array when no media items exist', () => {
			jest.spyOn(listMediaItemsUseCase, 'execute').mockResolvedValueOnce([]);

			return request(app.getHttpServer())
				.get('/media-items')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(Array.isArray(res.body)).toBe(true);
					expect(res.body).toHaveLength(0);
				});
		});
	});

	describe('PUT /media-items/:id', () => {
		it('should update a media item', () => {
			const updatedResponse = { ...mockMediaItemResponse, name: 'icon-energy-updated.svg' };
			jest.spyOn(updateMediaItemUseCase, 'execute').mockResolvedValueOnce(updatedResponse);

			return request(app.getHttpServer())
				.put(`/media-items/${mockMediaItemResponse.id}`)
				.send(updateDto)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toHaveProperty('id', mockMediaItemResponse.id);
					expect(res.body).toHaveProperty('name', 'icon-energy-updated.svg');
				});
		});

		it('should return 404 when trying to update non-existent media item', () => {
			const error = { statusCode: 404, message: 'MediaItem with id non-existent-id not found' };
			jest.spyOn(updateMediaItemUseCase, 'execute').mockRejectedValueOnce(error);

			return request(app.getHttpServer())
				.put('/media-items/non-existent-id')
				.send(updateDto)
				.expect(HttpStatus.NOT_FOUND);
		});
	});

	describe('DELETE /media-items/:id', () => {
		it('should delete a media item', () => {
			jest.spyOn(deleteMediaItemUseCase, 'execute').mockResolvedValueOnce(undefined);

			return request(app.getHttpServer())
				.delete(`/media-items/${mockMediaItemResponse.id}`)
				.expect(HttpStatus.NO_CONTENT);
		});

		it('should return 404 when trying to delete non-existent media item', () => {
			const error = { statusCode: 404, message: 'MediaItem with id non-existent-id not found' };
			jest.spyOn(deleteMediaItemUseCase, 'execute').mockRejectedValueOnce(error);

			return request(app.getHttpServer())
				.delete('/media-items/non-existent-id')
				.expect(HttpStatus.NOT_FOUND);
		});
	});
});
