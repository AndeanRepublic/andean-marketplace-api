import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

import { ExperienceController } from '../src/andean/infra/controllers/experienceControllers/experience.controller';
import { CreateExperienceUseCase } from '../src/andean/app/use_cases/experiences/CreateExperienceUseCase';
import { UpdateExperienceUseCase } from '../src/andean/app/use_cases/experiences/UpdateExperienceUseCase';
import { DeleteExperienceUseCase } from '../src/andean/app/use_cases/experiences/DeleteExperienceUseCase';
import { GetAllExperiencesUseCase } from '../src/andean/app/use_cases/experiences/GetAllExperiencesUseCase';
import { GetByIdExperienceUseCase } from '../src/andean/app/use_cases/experiences/GetByIdExperienceUseCase';

import { ExperienceStatus } from '../src/andean/domain/enums/ExperienceStatus';
import { Experience } from '../src/andean/domain/entities/experiences/Experience';

import { FixtureLoader } from './helpers/fixture-loader';

describe('ExperienceController (e2e)', () => {
	let app: INestApplication;
	let createExperienceUseCase: CreateExperienceUseCase;
	let getAllExperiencesUseCase: GetAllExperiencesUseCase;
	let updateExperienceUseCase: UpdateExperienceUseCase;
	let deleteExperienceUseCase: DeleteExperienceUseCase;
	let getByIdExperienceUseCase: GetByIdExperienceUseCase;

	// Load fixture data
	const fixture = FixtureLoader.loadExperience();
	const mockExperience = fixture.mockExperience as Experience;
	const createDto = fixture.createDto;
	const updateDto = fixture.updateDto;
	const mockPaginatedResponse = fixture.mockPaginatedResponse;
	const mockListItem = fixture.mockListItem;
	const mockDetailResponse = fixture.mockDetailResponse;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [ExperienceController],
			providers: [
				{
					provide: CreateExperienceUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue(mockExperience),
					},
				},
				{
					provide: GetAllExperiencesUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue(mockPaginatedResponse),
					},
				},
				{
					provide: UpdateExperienceUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue({
							...mockExperience,
							updatedAt: new Date('2026-02-01'),
						}),
					},
				},
				{
					provide: DeleteExperienceUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue(undefined),
					},
				},
				{
					provide: GetByIdExperienceUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue(mockDetailResponse),
					},
				},
			],
		}).compile();

		app = moduleFixture.createNestApplication();

		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
				forbidNonWhitelisted: true,
				transform: true,
			}),
		);

		await app.init();

		createExperienceUseCase = moduleFixture.get<CreateExperienceUseCase>(CreateExperienceUseCase);
		getAllExperiencesUseCase = moduleFixture.get<GetAllExperiencesUseCase>(GetAllExperiencesUseCase);
		updateExperienceUseCase = moduleFixture.get<UpdateExperienceUseCase>(UpdateExperienceUseCase);
		deleteExperienceUseCase = moduleFixture.get<DeleteExperienceUseCase>(DeleteExperienceUseCase);
		getByIdExperienceUseCase = moduleFixture.get<GetByIdExperienceUseCase>(GetByIdExperienceUseCase);
	});

	afterAll(async () => {
		await app.close();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	// ─── POST /experiences ──────────────────────────────────────────

	describe('POST /experiences', () => {
		it('should create a new experience', () => {
			jest.spyOn(createExperienceUseCase, 'handle').mockResolvedValueOnce(mockExperience);

			return request(app.getHttpServer())
				.post('/experiences')
				.send(createDto)
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: expect.any(String),
						status: ExperienceStatus.PUBLISHED,
						basicInfoId: expect.any(String),
						mediaInfoId: expect.any(String),
						detailInfoId: expect.any(String),
						pricesId: expect.any(String),
						availabilityId: expect.any(String),
						itineraryIds: expect.any(Array),
					});
					expect(res.body).toHaveProperty('createdAt');
					expect(res.body).toHaveProperty('updatedAt');
				});
		});

		it('should call the use case with correct dto', async () => {
			const spy = jest.spyOn(createExperienceUseCase, 'handle');

			await request(app.getHttpServer())
				.post('/experiences')
				.send(createDto)
				.expect(HttpStatus.CREATED);

			expect(spy).toHaveBeenCalledWith(
				expect.objectContaining({
					status: createDto.status,
					basicInfo: expect.objectContaining({ title: createDto.basicInfo.title }),
					mediaInfo: expect.objectContaining({ landscapeImg: createDto.mediaInfo.landscapeImg }),
					detailInfo: expect.objectContaining({ shortDescription: createDto.detailInfo.shortDescription }),
					prices: expect.objectContaining({ currency: createDto.prices.currency }),
					availability: expect.objectContaining({ weeklyStartDays: createDto.availability.weeklyStartDays }),
					itineraries: expect.any(Array),
				}),
			);
		});

		it('should return 400 when status is invalid', () => {
			const invalidDto = { ...createDto, status: 'INVALID_STATUS' };

			return request(app.getHttpServer())
				.post('/experiences')
				.send(invalidDto)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when basicInfo.title is missing', () => {
			const invalidDto = {
				...createDto,
				basicInfo: { ...createDto.basicInfo, title: undefined },
			};

			return request(app.getHttpServer())
				.post('/experiences')
				.send(invalidDto)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when basicInfo.days is less than 1', () => {
			const invalidDto = {
				...createDto,
				basicInfo: { ...createDto.basicInfo, days: 0 },
			};

			return request(app.getHttpServer())
				.post('/experiences')
				.send(invalidDto)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when mediaInfo.landscapeImg is missing', () => {
			const invalidDto = {
				...createDto,
				mediaInfo: { ...createDto.mediaInfo, landscapeImg: undefined },
			};

			return request(app.getHttpServer())
				.post('/experiences')
				.send(invalidDto)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when prices.ageGroups has invalid code', () => {
			const invalidDto = {
				...createDto,
				prices: {
					...createDto.prices,
					ageGroups: [
						{ code: 'INVALID', label: 'Test', price: 100 },
					],
				},
			};

			return request(app.getHttpServer())
				.post('/experiences')
				.send(invalidDto)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when prices.ageGroups has negative price', () => {
			const invalidDto = {
				...createDto,
				prices: {
					...createDto.prices,
					ageGroups: [
						{ code: 'ADULTS', label: 'Adultos', price: -50 },
					],
				},
			};

			return request(app.getHttpServer())
				.post('/experiences')
				.send(invalidDto)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when itineraries is not an array', () => {
			const invalidDto = { ...createDto, itineraries: 'not-an-array' };

			return request(app.getHttpServer())
				.post('/experiences')
				.send(invalidDto)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when detailInfo has invalid structure', () => {
			const invalidDto = {
				...createDto,
				detailInfo: { shortDescription: '' },
			};

			return request(app.getHttpServer())
				.post('/experiences')
				.send(invalidDto)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when availability.weeklyStartDays has invalid day', () => {
			const invalidDto = {
				...createDto,
				availability: {
					...createDto.availability,
					weeklyStartDays: [99],
				},
			};

			return request(app.getHttpServer())
				.post('/experiences')
				.send(invalidDto)
				.expect(HttpStatus.BAD_REQUEST);
		});
	});

	// ─── GET /experiences ───────────────────────────────────────────

	describe('GET /experiences', () => {
		it('should get all experiences without filters', async () => {
			jest.spyOn(getAllExperiencesUseCase, 'handle').mockResolvedValueOnce(mockPaginatedResponse);

			const response = await request(app.getHttpServer())
				.get('/experiences')
				.expect(HttpStatus.OK);

			expect(response.body).toHaveProperty('experiences');
			expect(response.body).toHaveProperty('pagination');
			expect(Array.isArray(response.body.experiences)).toBe(true);
			expect(response.body.pagination).toHaveProperty('total');
			expect(response.body.pagination).toHaveProperty('page');
			expect(response.body.pagination).toHaveProperty('per_page');
		});

		it('should return experience list items with correct structure', async () => {
			jest.spyOn(getAllExperiencesUseCase, 'handle').mockResolvedValueOnce(mockPaginatedResponse);

			const response = await request(app.getHttpServer())
				.get('/experiences')
				.expect(HttpStatus.OK);

			const experience = response.body.experiences[0];
			expect(experience).toHaveProperty('id');
			expect(experience).toHaveProperty('title');
			expect(experience).toHaveProperty('ownerName');
			expect(experience).toHaveProperty('price');
			expect(experience).toHaveProperty('place');
			expect(experience).toHaveProperty('days');
			expect(experience).toHaveProperty('mainImage');
			expect(experience.mainImage).toHaveProperty('name');
			expect(experience.mainImage).toHaveProperty('url');
		});

		it('should get experiences with pagination', async () => {
			const paginatedResponse = {
				experiences: [mockListItem],
				pagination: { total: 100, page: 2, per_page: 10 },
			};

			jest.spyOn(getAllExperiencesUseCase, 'handle').mockResolvedValueOnce(paginatedResponse);

			const response = await request(app.getHttpServer())
				.get('/experiences?page=2&per_page=10')
				.expect(HttpStatus.OK);

			expect(response.body.pagination).toHaveProperty('page');
			expect(response.body.pagination).toHaveProperty('per_page');
			expect(response.body.pagination).toHaveProperty('total');
		});

		it('should call the use case with correct pagination params', async () => {
			const spy = jest.spyOn(getAllExperiencesUseCase, 'handle');

			await request(app.getHttpServer())
				.get('/experiences?page=3&per_page=15')
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith(
				expect.objectContaining({ page: 3, perPage: 15 }),
			);
		});

		it('should filter experiences by category', async () => {
			const filteredResponse = {
				experiences: [mockListItem],
				pagination: { total: 1, page: 1, per_page: 20 },
			};

			const spy = jest.spyOn(getAllExperiencesUseCase, 'handle').mockResolvedValueOnce(filteredResponse);

			const response = await request(app.getHttpServer())
				.get('/experiences?category=trekking')
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith(
				expect.objectContaining({ category: 'trekking' }),
			);
			expect(response.body).toHaveProperty('experiences');
		});

		it('should filter experiences by owner_id', async () => {
			const filteredResponse = {
				experiences: [mockListItem],
				pagination: { total: 1, page: 1, per_page: 20 },
			};

			const spy = jest.spyOn(getAllExperiencesUseCase, 'handle').mockResolvedValueOnce(filteredResponse);

			const response = await request(app.getHttpServer())
				.get('/experiences?owner_id=community-001')
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith(
				expect.objectContaining({ ownerId: 'community-001' }),
			);
			expect(response.body).toHaveProperty('experiences');
		});

		it('should filter experiences by price range', async () => {
			const filteredResponse = {
				experiences: [mockListItem],
				pagination: { total: 1, page: 1, per_page: 20 },
			};

			const spy = jest.spyOn(getAllExperiencesUseCase, 'handle').mockResolvedValueOnce(filteredResponse);

			const response = await request(app.getHttpServer())
				.get('/experiences?min_price=50&max_price=200')
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith(
				expect.objectContaining({ minPrice: 50, maxPrice: 200 }),
			);
			expect(response.body).toHaveProperty('experiences');
		});

		it('should combine multiple filters', async () => {
			const filteredResponse = {
				experiences: [mockListItem],
				pagination: { total: 1, page: 1, per_page: 10 },
			};

			const spy = jest.spyOn(getAllExperiencesUseCase, 'handle').mockResolvedValueOnce(filteredResponse);

			await request(app.getHttpServer())
				.get('/experiences?page=1&per_page=10&category=trekking&owner_id=community-001&min_price=50&max_price=200')
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith(
				expect.objectContaining({
					page: 1,
					perPage: 10,
					category: 'trekking',
					ownerId: 'community-001',
					minPrice: 50,
					maxPrice: 200,
				}),
			);
		});

		it('should return empty list when no results', async () => {
			const emptyResponse = {
				experiences: [],
				pagination: { total: 0, page: 1, per_page: 20 },
			};

			jest.spyOn(getAllExperiencesUseCase, 'handle').mockResolvedValueOnce(emptyResponse);

			const response = await request(app.getHttpServer())
				.get('/experiences?category=nonexistent')
				.expect(HttpStatus.OK);

			expect(response.body.experiences).toHaveLength(0);
			expect(response.body.pagination.total).toBe(0);
		});
	});

	// ─── GET /experiences/:id ───────────────────────────────────────

	describe('GET /experiences/:id', () => {
		const experienceId = 'exp-uuid-001';

		it('should return a full experience with resolved media', async () => {
			jest.spyOn(getByIdExperienceUseCase, 'handle').mockResolvedValueOnce(mockDetailResponse);

			const response = await request(app.getHttpServer())
				.get(`/experiences/${experienceId}`)
				.expect(HttpStatus.OK);

			// Main structure
			expect(response.body).toHaveProperty('id');
			expect(response.body).toHaveProperty('status');
			expect(response.body).toHaveProperty('basicInfo');
			expect(response.body).toHaveProperty('mediaInfo');
			expect(response.body).toHaveProperty('detailInfo');
			expect(response.body).toHaveProperty('prices');
			expect(response.body).toHaveProperty('availability');
			expect(response.body).toHaveProperty('itineraries');
			expect(response.body).toHaveProperty('createdAt');
			expect(response.body).toHaveProperty('updatedAt');
		});

		it('should return basicInfo with correct structure', async () => {
			jest.spyOn(getByIdExperienceUseCase, 'handle').mockResolvedValueOnce(mockDetailResponse);

			const response = await request(app.getHttpServer())
				.get(`/experiences/${experienceId}`)
				.expect(HttpStatus.OK);

			const { basicInfo } = response.body;
			expect(basicInfo).toHaveProperty('title');
			expect(basicInfo).toHaveProperty('ubication');
			expect(basicInfo).toHaveProperty('days');
			expect(basicInfo).toHaveProperty('nights');
			expect(basicInfo).toHaveProperty('languages');
			expect(basicInfo).toHaveProperty('ownerType');
			expect(basicInfo).toHaveProperty('ownerId');
		});

		it('should return mediaInfo with resolved MediaItems (not IDs)', async () => {
			jest.spyOn(getByIdExperienceUseCase, 'handle').mockResolvedValueOnce(mockDetailResponse);

			const response = await request(app.getHttpServer())
				.get(`/experiences/${experienceId}`)
				.expect(HttpStatus.OK);

			const { mediaInfo } = response.body;

			// landscapeImg should be an object with url, not a string ID
			expect(typeof mediaInfo.landscapeImg).toBe('object');
			expect(mediaInfo.landscapeImg).toHaveProperty('id');
			expect(mediaInfo.landscapeImg).toHaveProperty('name');
			expect(mediaInfo.landscapeImg).toHaveProperty('url');
			expect(mediaInfo.landscapeImg).toHaveProperty('type');
			expect(mediaInfo.landscapeImg).toHaveProperty('role');

			// thumbnailImg should be resolved too
			expect(typeof mediaInfo.thumbnailImg).toBe('object');
			expect(mediaInfo.thumbnailImg).toHaveProperty('url');

			// photos should be array of resolved objects
			expect(Array.isArray(mediaInfo.photos)).toBe(true);
			if (mediaInfo.photos.length > 0) {
				expect(mediaInfo.photos[0]).toHaveProperty('id');
				expect(mediaInfo.photos[0]).toHaveProperty('url');
			}
		});

		it('should return itineraries with resolved photos', async () => {
			jest.spyOn(getByIdExperienceUseCase, 'handle').mockResolvedValueOnce(mockDetailResponse);

			const response = await request(app.getHttpServer())
				.get(`/experiences/${experienceId}`)
				.expect(HttpStatus.OK);

			const { itineraries } = response.body;
			expect(Array.isArray(itineraries)).toBe(true);
			expect(itineraries.length).toBeGreaterThan(0);

			const firstDay = itineraries[0];
			expect(firstDay).toHaveProperty('numberDay');
			expect(firstDay).toHaveProperty('nameDay');
			expect(firstDay).toHaveProperty('descriptionDay');
			expect(firstDay).toHaveProperty('schedule');
			expect(Array.isArray(firstDay.photos)).toBe(true);

			// Photos should be resolved objects, not string IDs
			if (firstDay.photos.length > 0) {
				expect(firstDay.photos[0]).toHaveProperty('id');
				expect(firstDay.photos[0]).toHaveProperty('url');
				expect(firstDay.photos[0]).toHaveProperty('name');
			}
		});

		it('should call the use case with correct id', async () => {
			const spy = jest.spyOn(getByIdExperienceUseCase, 'handle');

			await request(app.getHttpServer())
				.get(`/experiences/${experienceId}`)
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith(experienceId);
		});

		it('should return prices with ageGroups', async () => {
			jest.spyOn(getByIdExperienceUseCase, 'handle').mockResolvedValueOnce(mockDetailResponse);

			const response = await request(app.getHttpServer())
				.get(`/experiences/${experienceId}`)
				.expect(HttpStatus.OK);

			const { prices } = response.body;
			expect(prices).toHaveProperty('useAgeBasedPricing');
			expect(prices).toHaveProperty('currency');
			expect(prices).toHaveProperty('ageGroups');
			expect(Array.isArray(prices.ageGroups)).toBe(true);
			expect(prices.ageGroups[0]).toHaveProperty('code');
			expect(prices.ageGroups[0]).toHaveProperty('price');
		});
	});

	// ─── PUT /experiences/:id ───────────────────────────────────────

	describe('PUT /experiences/:id', () => {
		const experienceId = 'exp-uuid-001';

		it('should update an existing experience', async () => {
			const updatedMock = {
				...mockExperience,
				updatedAt: new Date('2026-02-01'),
			};

			jest.spyOn(updateExperienceUseCase, 'handle').mockResolvedValueOnce(updatedMock);

			const response = await request(app.getHttpServer())
				.put(`/experiences/${experienceId}`)
				.send(updateDto)
				.expect(HttpStatus.OK);

			expect(response.body).toHaveProperty('id', experienceId);
			expect(response.body).toHaveProperty('status');
		});

		it('should call the use case with id and dto', async () => {
			const spy = jest.spyOn(updateExperienceUseCase, 'handle');

			await request(app.getHttpServer())
				.put(`/experiences/${experienceId}`)
				.send(updateDto)
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith(
				experienceId,
				expect.objectContaining({
					status: updateDto.status,
				}),
			);
		});

		it('should allow partial update with only basicInfo', async () => {
			const partialDto = {
				basicInfo: {
					title: 'Título actualizado',
					ubication: 'Cusco, Perú',
					days: 2,
					nights: 1,
					minNumberGroup: 2,
					maxNumberGroup: 10,
					languages: ['ESPAÑOL'],
					ownerType: 'COMMUNITY',
					ownerId: 'community-001',
				},
			};

			jest.spyOn(updateExperienceUseCase, 'handle').mockResolvedValueOnce(mockExperience);

			await request(app.getHttpServer())
				.put(`/experiences/${experienceId}`)
				.send(partialDto)
				.expect(HttpStatus.OK);
		});

		it('should allow partial update with only prices', async () => {
			const partialDto = {
				prices: {
					useAgeBasedPricing: true,
					currency: 'PEN',
					ageGroups: [
						{ code: 'ADULTS', label: 'Adultos', price: 350, minAge: 18 },
					],
				},
			};

			jest.spyOn(updateExperienceUseCase, 'handle').mockResolvedValueOnce(mockExperience);

			await request(app.getHttpServer())
				.put(`/experiences/${experienceId}`)
				.send(partialDto)
				.expect(HttpStatus.OK);
		});

		it('should return 400 when invalid data is sent', () => {
			const invalidDto = {
				status: 'INVALID_STATUS',
			};

			return request(app.getHttpServer())
				.put(`/experiences/${experienceId}`)
				.send(invalidDto)
				.expect(HttpStatus.BAD_REQUEST);
		});
	});

	// ─── DELETE /experiences/:id ─────────────────────────────────────

	describe('DELETE /experiences/:id', () => {
		const experienceId = 'exp-uuid-001';

		it('should delete an experience', async () => {
			jest.spyOn(deleteExperienceUseCase, 'handle').mockResolvedValueOnce(undefined);

			await request(app.getHttpServer())
				.delete(`/experiences/${experienceId}`)
				.expect(HttpStatus.NO_CONTENT);
		});

		it('should call the use case with correct id', async () => {
			const spy = jest.spyOn(deleteExperienceUseCase, 'handle');

			await request(app.getHttpServer())
				.delete(`/experiences/${experienceId}`)
				.expect(HttpStatus.NO_CONTENT);

			expect(spy).toHaveBeenCalledWith(experienceId);
		});
	});
});
