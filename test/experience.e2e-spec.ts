import { Test, TestingModule } from '@nestjs/testing';
import {
	INestApplication,
	HttpStatus,
	ValidationPipe,
	ForbiddenException,
	NotFoundException,
} from '@nestjs/common';
import request from 'supertest';

import { ExperienceController } from '../src/andean/infra/controllers/experienceControllers/experience.controller';
import { JwtAuthGuard } from '../src/andean/infra/core/jwtAuth.guard';
import { RolesGuard } from '../src/andean/infra/core/roles.guard';
import {
	createAllowAllGuard,
	createDenyAllGuard,
	mockAuthUsers,
} from './helpers/auth-test.helper';
import { CreateExperienceUseCase } from '../src/andean/app/use_cases/experiences/CreateExperienceUseCase';
import { UpdateExperienceUseCase } from '../src/andean/app/use_cases/experiences/UpdateExperienceUseCase';
import { DeleteExperienceUseCase } from '../src/andean/app/use_cases/experiences/DeleteExperienceUseCase';
import { GetAllExperiencesUseCase } from '../src/andean/app/use_cases/experiences/GetAllExperiencesUseCase';
import { GetAllExperiencesForManagementUseCase } from '../src/andean/app/use_cases/experiences/GetAllExperiencesForManagementUseCase';
import { GetByIdExperienceUseCase } from '../src/andean/app/use_cases/experiences/GetByIdExperienceUseCase';
import { UpdateExperienceStatusUseCase } from '../src/andean/app/use_cases/experiences/UpdateExperienceStatusUseCase';
import { GetExperienceForEditUseCase } from '../src/andean/app/use_cases/experiences/GetExperienceForEditUseCase';

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
					provide: GetAllExperiencesForManagementUseCase,
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
				{
					provide: UpdateExperienceStatusUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(mockExperience) },
				},
				{
					provide: GetExperienceForEditUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(mockExperience) },
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

		createExperienceUseCase = moduleFixture.get<CreateExperienceUseCase>(
			CreateExperienceUseCase,
		);
		getAllExperiencesUseCase = moduleFixture.get<GetAllExperiencesUseCase>(
			GetAllExperiencesUseCase,
		);
		updateExperienceUseCase = moduleFixture.get<UpdateExperienceUseCase>(
			UpdateExperienceUseCase,
		);
		deleteExperienceUseCase = moduleFixture.get<DeleteExperienceUseCase>(
			DeleteExperienceUseCase,
		);
		getByIdExperienceUseCase = moduleFixture.get<GetByIdExperienceUseCase>(
			GetByIdExperienceUseCase,
		);
	});

	afterAll(async () => {
		if (app) {
			await app.close();
		}
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	// ─── POST /experiences ──────────────────────────────────────────

	describe('POST /experiences', () => {
		it('should create a new experience', () => {
			jest
				.spyOn(createExperienceUseCase, 'handle')
				.mockResolvedValueOnce(mockExperience);

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
					basicInfo: expect.objectContaining({
						title: createDto.basicInfo.title,
					}),
					mediaInfo: expect.objectContaining({
						landscapeImg: createDto.mediaInfo.landscapeImg,
					}),
					detailInfo: expect.objectContaining({
						shortDescription: createDto.detailInfo.shortDescription,
					}),
					prices: expect.objectContaining({
						currency: createDto.prices.currency,
					}),
					availability: expect.objectContaining({
						weeklyStartDays: createDto.availability.weeklyStartDays,
					}),
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
					ageGroups: [{ code: 'INVALID', label: 'Test', price: 100 }],
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
					ageGroups: [{ code: 'ADULTS', label: 'Adultos', price: -50 }],
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
			jest
				.spyOn(getAllExperiencesUseCase, 'handle')
				.mockResolvedValueOnce(mockPaginatedResponse);

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
			jest
				.spyOn(getAllExperiencesUseCase, 'handle')
				.mockResolvedValueOnce(mockPaginatedResponse);

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

			jest
				.spyOn(getAllExperiencesUseCase, 'handle')
				.mockResolvedValueOnce(paginatedResponse);

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

			const spy = jest
				.spyOn(getAllExperiencesUseCase, 'handle')
				.mockResolvedValueOnce(filteredResponse);

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

			const spy = jest
				.spyOn(getAllExperiencesUseCase, 'handle')
				.mockResolvedValueOnce(filteredResponse);

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

			const spy = jest
				.spyOn(getAllExperiencesUseCase, 'handle')
				.mockResolvedValueOnce(filteredResponse);

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

			const spy = jest
				.spyOn(getAllExperiencesUseCase, 'handle')
				.mockResolvedValueOnce(filteredResponse);

			await request(app.getHttpServer())
				.get(
					'/experiences?page=1&per_page=10&category=trekking&owner_id=community-001&min_price=50&max_price=200',
				)
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

			jest
				.spyOn(getAllExperiencesUseCase, 'handle')
				.mockResolvedValueOnce(emptyResponse);

			const response = await request(app.getHttpServer())
				.get('/experiences?category=nonexistent')
				.expect(HttpStatus.OK);

			expect(response.body.experiences).toHaveLength(0);
			expect(response.body.pagination.total).toBe(0);
		});
	});

	// ─── GET /experiences/:id (V2 format) ───────────────────────────

	describe('GET /experiences/:id', () => {
		const experienceId = 'exp-uuid-001';

		it('should return the V2 response structure with all sections', async () => {
			jest
				.spyOn(getByIdExperienceUseCase, 'handle')
				.mockResolvedValueOnce(mockDetailResponse);

			const response = await request(app.getHttpServer())
				.get(`/experiences/${experienceId}`)
				.expect(HttpStatus.OK);

			expect(response.body).toHaveProperty('heroDetail');
			expect(response.body).toHaveProperty('information');
			expect(response.body).toHaveProperty('questionSection');
			expect(response.body).toHaveProperty('itinerary');
			expect(response.body).toHaveProperty('moreExperiences');
			expect(response.body).toHaveProperty('review');
		});

		it('should return heroDetail with correct structure', async () => {
			jest
				.spyOn(getByIdExperienceUseCase, 'handle')
				.mockResolvedValueOnce(mockDetailResponse);

			const response = await request(app.getHttpServer())
				.get(`/experiences/${experienceId}`)
				.expect(HttpStatus.OK);

			const { heroDetail } = response.body;
			expect(heroDetail).toHaveProperty('title');
			expect(heroDetail).toHaveProperty('shortDescription');
			expect(heroDetail).toHaveProperty('largeDescription');
			expect(heroDetail).toHaveProperty('days');
			expect(heroDetail).toHaveProperty('nights');
			expect(heroDetail).toHaveProperty('price');
			expect(heroDetail).toHaveProperty('landscapeImgUrl');
			expect(heroDetail).toHaveProperty('photos');
			expect(heroDetail).toHaveProperty('ownerId');
			expect(heroDetail).toHaveProperty('ownerType');
			expect(heroDetail).toHaveProperty('ownerTitle');
			expect(heroDetail).toHaveProperty('ownerImgUrl');

			expect(heroDetail.title).toBe('Trekking al Valle Sagrado');
			expect(heroDetail.days).toBe(3);
			expect(heroDetail.nights).toBe(2);
			expect(heroDetail.price).toBe(120);
			expect(heroDetail.ownerType).toBe('COMMUNITY');
		});

		it('should return heroDetail.photos as resolved MediaItems (not IDs)', async () => {
			jest
				.spyOn(getByIdExperienceUseCase, 'handle')
				.mockResolvedValueOnce(mockDetailResponse);

			const response = await request(app.getHttpServer())
				.get(`/experiences/${experienceId}`)
				.expect(HttpStatus.OK);

			const { photos } = response.body.heroDetail;
			expect(Array.isArray(photos)).toBe(true);
			expect(photos.length).toBeGreaterThan(0);

			const photo = photos[0];
			expect(photo).toHaveProperty('id');
			expect(photo).toHaveProperty('type');
			expect(photo).toHaveProperty('name');
			expect(photo).toHaveProperty('url');
			expect(photo).toHaveProperty('role');
			expect(photo).toHaveProperty('key');
			expect(typeof photo.url).toBe('string');
			expect(photo.url).toContain('https://');
		});

		it('should return information with ages, duration and languages', async () => {
			jest
				.spyOn(getByIdExperienceUseCase, 'handle')
				.mockResolvedValueOnce(mockDetailResponse);

			const response = await request(app.getHttpServer())
				.get(`/experiences/${experienceId}`)
				.expect(HttpStatus.OK);

			const { information } = response.body;
			expect(information).toHaveProperty('minAge');
			expect(information).toHaveProperty('maxAge');
			expect(information).toHaveProperty('duration');
			expect(information).toHaveProperty('languages');
			expect(typeof information.minAge).toBe('number');
			expect(typeof information.maxAge).toBe('number');
			expect(information.duration).toBe(3);
			expect(Array.isArray(information.languages)).toBe(true);
		});

		it('should return questionSection with all required fields', async () => {
			jest
				.spyOn(getByIdExperienceUseCase, 'handle')
				.mockResolvedValueOnce(mockDetailResponse);

			const response = await request(app.getHttpServer())
				.get(`/experiences/${experienceId}`)
				.expect(HttpStatus.OK);

			const { questionSection } = response.body;
			expect(questionSection).toHaveProperty('includes');
			expect(questionSection).toHaveProperty('pickupDetail');
			expect(questionSection).toHaveProperty('returnDetail');
			expect(questionSection).toHaveProperty('accommodationDetail');
			expect(questionSection).toHaveProperty('accessibilityDetail');
			expect(questionSection).toHaveProperty('cancellationPolicy');
			expect(typeof questionSection.includes).toBe('string');
			expect(questionSection.includes).toContain(',');
		});

		it('should return itinerary with resolved photos', async () => {
			jest
				.spyOn(getByIdExperienceUseCase, 'handle')
				.mockResolvedValueOnce(mockDetailResponse);

			const response = await request(app.getHttpServer())
				.get(`/experiences/${experienceId}`)
				.expect(HttpStatus.OK);

			const { itinerary } = response.body;
			expect(Array.isArray(itinerary)).toBe(true);
			expect(itinerary.length).toBeGreaterThan(0);

			const firstDay = itinerary[0];
			expect(firstDay).toHaveProperty('numberDay');
			expect(firstDay).toHaveProperty('nameDay');
			expect(firstDay).toHaveProperty('descriptionDay');
			expect(firstDay).toHaveProperty('schedule');
			expect(Array.isArray(firstDay.photos)).toBe(true);

			if (firstDay.photos.length > 0) {
				expect(firstDay.photos[0]).toHaveProperty('id');
				expect(firstDay.photos[0]).toHaveProperty('url');
				expect(firstDay.photos[0]).toHaveProperty('key');
			}

			expect(firstDay.schedule[0]).toHaveProperty('time');
			expect(firstDay.schedule[0]).toHaveProperty('activity');
		});

		it('should return moreExperiences with max 3 items', async () => {
			jest
				.spyOn(getByIdExperienceUseCase, 'handle')
				.mockResolvedValueOnce(mockDetailResponse);

			const response = await request(app.getHttpServer())
				.get(`/experiences/${experienceId}`)
				.expect(HttpStatus.OK);

			const { moreExperiences } = response.body;
			expect(Array.isArray(moreExperiences)).toBe(true);
			expect(moreExperiences.length).toBeLessThanOrEqual(3);

			if (moreExperiences.length > 0) {
				const item = moreExperiences[0];
				expect(item).toHaveProperty('id');
				expect(item).toHaveProperty('title');
				expect(item).toHaveProperty('ownerName');
				expect(item).toHaveProperty('price');
				expect(item).toHaveProperty('place');
				expect(item).toHaveProperty('days');
				expect(item).toHaveProperty('mainImage');
				expect(item.mainImage).toHaveProperty('id');
				expect(item.mainImage).toHaveProperty('url');

				// Should not include current experience
				moreExperiences.forEach((exp: any) => {
					expect(exp.id).not.toBe(experienceId);
				});
			}
		});

		it('should return review with rating stats and comments', async () => {
			jest
				.spyOn(getByIdExperienceUseCase, 'handle')
				.mockResolvedValueOnce(mockDetailResponse);

			const response = await request(app.getHttpServer())
				.get(`/experiences/${experienceId}`)
				.expect(HttpStatus.OK);

			const { review } = response.body;
			expect(review).toHaveProperty('rating');
			expect(review).toHaveProperty('comments');

			// Rating stats
			expect(review.rating).toHaveProperty('count5stars');
			expect(review.rating).toHaveProperty('count4stars');
			expect(review.rating).toHaveProperty('count3stars');
			expect(review.rating).toHaveProperty('count2stars');
			expect(review.rating).toHaveProperty('count1star');
			expect(review.rating).toHaveProperty('totalReviews');
			expect(review.rating).toHaveProperty('averagePunctuation');
			expect(typeof review.rating.totalReviews).toBe('number');
			expect(typeof review.rating.averagePunctuation).toBe('number');

			// Comments
			expect(Array.isArray(review.comments)).toBe(true);
			if (review.comments.length > 0) {
				const comment = review.comments[0];
				expect(comment).toHaveProperty('idReview');
				expect(comment).toHaveProperty('nameUser');
				expect(comment).toHaveProperty('content');
				expect(comment).toHaveProperty('numberStarts');
				expect(comment).toHaveProperty('date');
				expect(comment).toHaveProperty('likes');
				expect(comment).toHaveProperty('dislikes');
			}
		});

		it('should call the use case with correct id', async () => {
			const spy = jest.spyOn(getByIdExperienceUseCase, 'handle');

			await request(app.getHttpServer())
				.get(`/experiences/${experienceId}`)
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith(experienceId);
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

			jest
				.spyOn(updateExperienceUseCase, 'handle')
				.mockResolvedValueOnce(updatedMock);

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
				mockAuthUsers.seller.userId,
				mockAuthUsers.seller.roles,
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

			jest
				.spyOn(updateExperienceUseCase, 'handle')
				.mockResolvedValueOnce(mockExperience);

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

			jest
				.spyOn(updateExperienceUseCase, 'handle')
				.mockResolvedValueOnce(mockExperience);

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
			jest
				.spyOn(deleteExperienceUseCase, 'handle')
				.mockResolvedValueOnce(undefined);

			await request(app.getHttpServer())
				.delete(`/experiences/${experienceId}`)
				.expect(HttpStatus.NO_CONTENT);
		});

		it('should call the use case with correct id', async () => {
			const spy = jest.spyOn(deleteExperienceUseCase, 'handle');

			await request(app.getHttpServer())
				.delete(`/experiences/${experienceId}`)
				.expect(HttpStatus.NO_CONTENT);

			expect(spy).toHaveBeenCalledWith(
				experienceId,
				mockAuthUsers.seller.userId,
				mockAuthUsers.seller.roles,
			);
		});
	});

	// ─── Ownership enforcement (PUT/DELETE) ────────────────────────────────────
	describe('ownership enforcement', () => {
		const experienceId = 'exp-uuid-001';

		async function buildApp(
			authUser: { userId: string; email: string; roles: any[] } | null,
		): Promise<INestApplication> {
			const module: TestingModule = await Test.createTestingModule({
				controllers: [ExperienceController],
				providers: [
					{
						provide: CreateExperienceUseCase,
						useValue: { handle: jest.fn().mockResolvedValue(mockExperience) },
					},
					{
						provide: GetAllExperiencesUseCase,
						useValue: {
							handle: jest.fn().mockResolvedValue(mockPaginatedResponse),
						},
					},
					{
						provide: GetAllExperiencesForManagementUseCase,
						useValue: {
							handle: jest.fn().mockResolvedValue(mockPaginatedResponse),
						},
					},
					{
						provide: UpdateExperienceUseCase,
						useValue: { handle: jest.fn().mockResolvedValue(mockExperience) },
					},
					{
						provide: DeleteExperienceUseCase,
						useValue: { handle: jest.fn().mockResolvedValue(undefined) },
					},
					{
						provide: GetByIdExperienceUseCase,
						useValue: {
							handle: jest.fn().mockResolvedValue(mockDetailResponse),
						},
					},
					{
						provide: UpdateExperienceStatusUseCase,
						useValue: { handle: jest.fn().mockResolvedValue(mockExperience) },
					},
					{
						provide: GetExperienceForEditUseCase,
						useValue: { handle: jest.fn().mockResolvedValue(mockExperience) },
					},
				],
			})
				.overrideGuard(JwtAuthGuard)
				.useValue(
					authUser ? createAllowAllGuard(authUser) : createDenyAllGuard(),
				)
				.overrideGuard(RolesGuard)
				.useValue({ canActivate: () => true })
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

		// ── PUT /experiences/:id ownership ────────────────────────────────
		describe('PUT /experiences/:id', () => {
			it('should return 200 when SELLER owner updates the experience', async () => {
				const ownerApp = await buildApp(mockAuthUsers.seller);
				const uc = ownerApp.get(UpdateExperienceUseCase);
				jest.spyOn(uc, 'handle').mockResolvedValueOnce(mockExperience);

				await request(ownerApp.getHttpServer())
					.put(`/experiences/${experienceId}`)
					.send(updateDto)
					.expect(HttpStatus.OK);

				await ownerApp.close();
			});

			it('should return 403 when SELLER non-owner tries to update', async () => {
				const nonOwnerApp = await buildApp(mockAuthUsers.seller);
				const uc = nonOwnerApp.get(UpdateExperienceUseCase);
				jest
					.spyOn(uc, 'handle')
					.mockRejectedValueOnce(
						new ForbiddenException('You can only modify your own resource'),
					);

				await request(nonOwnerApp.getHttpServer())
					.put(`/experiences/${experienceId}`)
					.send(updateDto)
					.expect(HttpStatus.FORBIDDEN);

				await nonOwnerApp.close();
			});

			it('should return 403 when SELLER tries to update COMMUNITY-owned experience', async () => {
				const sellerApp = await buildApp(mockAuthUsers.seller);
				const uc = sellerApp.get(UpdateExperienceUseCase);
				jest
					.spyOn(uc, 'handle')
					.mockRejectedValueOnce(
						new ForbiddenException('You can only modify your own resource'),
					);

				await request(sellerApp.getHttpServer())
					.put(`/experiences/${experienceId}`)
					.send(updateDto)
					.expect(HttpStatus.FORBIDDEN);

				await sellerApp.close();
			});

			it('should return 200 when ADMIN updates any experience', async () => {
				const adminApp = await buildApp(mockAuthUsers.admin);
				const uc = adminApp.get(UpdateExperienceUseCase);
				jest.spyOn(uc, 'handle').mockResolvedValueOnce(mockExperience);

				await request(adminApp.getHttpServer())
					.put(`/experiences/${experienceId}`)
					.send(updateDto)
					.expect(HttpStatus.OK);

				await adminApp.close();
			});

			it('should return 401 when no token is provided', async () => {
				const unauthApp = await buildApp(null);

				await request(unauthApp.getHttpServer())
					.put(`/experiences/${experienceId}`)
					.send(updateDto)
					.expect(HttpStatus.UNAUTHORIZED);

				await unauthApp.close();
			});
		});

		// ── DELETE /experiences/:id ownership ─────────────────────────────
		describe('DELETE /experiences/:id', () => {
			it('should return 204 when SELLER owner deletes the experience', async () => {
				const ownerApp = await buildApp(mockAuthUsers.seller);
				const uc = ownerApp.get(DeleteExperienceUseCase);
				jest.spyOn(uc, 'handle').mockResolvedValueOnce(undefined);

				await request(ownerApp.getHttpServer())
					.delete(`/experiences/${experienceId}`)
					.expect(HttpStatus.NO_CONTENT);

				await ownerApp.close();
			});

			it('should return 403 when SELLER non-owner tries to delete', async () => {
				const nonOwnerApp = await buildApp(mockAuthUsers.seller);
				const uc = nonOwnerApp.get(DeleteExperienceUseCase);
				jest
					.spyOn(uc, 'handle')
					.mockRejectedValueOnce(
						new ForbiddenException('You can only modify your own resource'),
					);

				await request(nonOwnerApp.getHttpServer())
					.delete(`/experiences/${experienceId}`)
					.expect(HttpStatus.FORBIDDEN);

				await nonOwnerApp.close();
			});

			it('should return 403 when SELLER tries to delete COMMUNITY-owned experience', async () => {
				const sellerApp = await buildApp(mockAuthUsers.seller);
				const uc = sellerApp.get(DeleteExperienceUseCase);
				jest
					.spyOn(uc, 'handle')
					.mockRejectedValueOnce(
						new ForbiddenException('You can only modify your own resource'),
					);

				await request(sellerApp.getHttpServer())
					.delete(`/experiences/${experienceId}`)
					.expect(HttpStatus.FORBIDDEN);

				await sellerApp.close();
			});

			it('should return 204 when ADMIN deletes any experience', async () => {
				const adminApp = await buildApp(mockAuthUsers.admin);
				const uc = adminApp.get(DeleteExperienceUseCase);
				jest.spyOn(uc, 'handle').mockResolvedValueOnce(undefined);

				await request(adminApp.getHttpServer())
					.delete(`/experiences/${experienceId}`)
					.expect(HttpStatus.NO_CONTENT);

				await adminApp.close();
			});

			it('should return 401 when no token is provided', async () => {
				const unauthApp = await buildApp(null);

				await request(unauthApp.getHttpServer())
					.delete(`/experiences/${experienceId}`)
					.expect(HttpStatus.UNAUTHORIZED);

				await unauthApp.close();
			});
		});

		// ── POST /experiences — Pattern A USER→403 ─────────────────────────
		describe('POST /experiences', () => {
			it('should return 403 when USER tries to create an experience', async () => {
				const module: TestingModule = await Test.createTestingModule({
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
							provide: GetAllExperiencesForManagementUseCase,
							useValue: {
								handle: jest.fn().mockResolvedValue(mockPaginatedResponse),
							},
						},
						{
							provide: UpdateExperienceUseCase,
							useValue: {
								handle: jest.fn().mockResolvedValue(mockExperience),
							},
						},
						{
							provide: DeleteExperienceUseCase,
							useValue: { handle: jest.fn().mockResolvedValue(undefined) },
						},
						{
							provide: GetByIdExperienceUseCase,
							useValue: {
								handle: jest.fn().mockResolvedValue(mockDetailResponse),
							},
						},
						{
							provide: UpdateExperienceStatusUseCase,
							useValue: { handle: jest.fn().mockResolvedValue(mockExperience) },
						},
						{
							provide: GetExperienceForEditUseCase,
							useValue: { handle: jest.fn().mockResolvedValue(mockExperience) },
						},
					],
				})
					.overrideGuard(JwtAuthGuard)
					.useValue(createAllowAllGuard(mockAuthUsers.customer))
					.overrideGuard(RolesGuard)
					.useValue({ canActivate: () => false })
					.compile();

				const userApp = module.createNestApplication();
				userApp.useGlobalPipes(
					new ValidationPipe({
						whitelist: true,
						forbidNonWhitelisted: true,
						transform: true,
					}),
				);
				await userApp.init();

				await request(userApp.getHttpServer())
					.post('/experiences')
					.send(createDto)
					.expect(HttpStatus.FORBIDDEN);

				await userApp.close();
			});
		});

		// ── PUT /experiences/:id — Pattern F additional ────────────────────
		describe('PUT /experiences/:id additional', () => {
			it('should return 403 when SELLER has no SellerProfile', async () => {
				const sellerApp = await buildApp(mockAuthUsers.seller);
				const uc = sellerApp.get(UpdateExperienceUseCase);
				jest
					.spyOn(uc, 'handle')
					.mockRejectedValueOnce(
						new ForbiddenException('Seller profile not found'),
					);

				await request(sellerApp.getHttpServer())
					.put(`/experiences/${experienceId}`)
					.send(updateDto)
					.expect(HttpStatus.FORBIDDEN);

				await sellerApp.close();
			});

			it('should return 404 when experience does not exist', async () => {
				const sellerApp = await buildApp(mockAuthUsers.seller);
				const uc = sellerApp.get(UpdateExperienceUseCase);
				jest
					.spyOn(uc, 'handle')
					.mockRejectedValueOnce(new NotFoundException('Experience not found'));

				await request(sellerApp.getHttpServer())
					.put('/experiences/non-existent-id')
					.send(updateDto)
					.expect(HttpStatus.NOT_FOUND);

				await sellerApp.close();
			});
		});

		// ── DELETE /experiences/:id — Pattern F additional ─────────────────
		describe('DELETE /experiences/:id additional', () => {
			it('should return 403 when SELLER has no SellerProfile', async () => {
				const sellerApp = await buildApp(mockAuthUsers.seller);
				const uc = sellerApp.get(DeleteExperienceUseCase);
				jest
					.spyOn(uc, 'handle')
					.mockRejectedValueOnce(
						new ForbiddenException('Seller profile not found'),
					);

				await request(sellerApp.getHttpServer())
					.delete(`/experiences/${experienceId}`)
					.expect(HttpStatus.FORBIDDEN);

				await sellerApp.close();
			});

			it('should return 404 when experience does not exist', async () => {
				const sellerApp = await buildApp(mockAuthUsers.seller);
				const uc = sellerApp.get(DeleteExperienceUseCase);
				jest
					.spyOn(uc, 'handle')
					.mockRejectedValueOnce(new NotFoundException('Experience not found'));

				await request(sellerApp.getHttpServer())
					.delete('/experiences/non-existent-id')
					.expect(HttpStatus.NOT_FOUND);

				await sellerApp.close();
			});
		});
	});
});
