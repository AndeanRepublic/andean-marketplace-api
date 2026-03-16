import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

import { ExperiencePricesController } from '../src/andean/infra/controllers/experienceControllers/experience-prices.controller';
import { ExperienceAvailabilityController } from '../src/andean/infra/controllers/experienceControllers/experience-availability.controller';
import { UpdatePriceByAgeGroupUseCase } from '../src/andean/app/use_cases/experiences/prices/UpdatePriceByAgeGroupUseCase';
import { UpdateExcludedDatesUseCase } from '../src/andean/app/use_cases/experiences/availability/UpdateExcludedDatesUseCase';
import { UpdateAvailableDatesUseCase } from '../src/andean/app/use_cases/experiences/availability/UpdateAvailableDatesUseCase';

import { ExperiencePrices } from '../src/andean/domain/entities/experiences/ExperiencePrices';
import { ExperienceAvailability } from '../src/andean/domain/entities/experiences/ExperienceAvailability';

import { FixtureLoader } from './helpers/fixture-loader';

describe('ExperiencePricesController & ExperienceAvailabilityController (e2e)', () => {
	let app: INestApplication;
	let updatePriceByAgeGroupUseCase: UpdatePriceByAgeGroupUseCase;
	let updateExcludedDatesUseCase: UpdateExcludedDatesUseCase;
	let updateAvailableDatesUseCase: UpdateAvailableDatesUseCase;

	// Load fixture data
	const fixture = FixtureLoader.loadExperience();
	const mockPrices = fixture.mockPrices as ExperiencePrices;
	const mockPricesAfterAdultsPatch =
		fixture.mockPricesAfterAdultsPatch as ExperiencePrices;
	const mockPricesAfterChildPatch =
		fixture.mockPricesAfterChildPatch as ExperiencePrices;
	const patchAdultsPriceDto = fixture.patchAdultsPriceDto;
	const patchChildPriceDto = fixture.patchChildPriceDto;
	const mockAvailability = fixture.mockAvailability as ExperienceAvailability;
	const mockAvailabilityAfterExcludedPatch =
		fixture.mockAvailabilityAfterExcludedPatch as ExperienceAvailability;
	const mockAvailabilityAfterAvailablePatch =
		fixture.mockAvailabilityAfterAvailablePatch as ExperienceAvailability;
	const patchExcludedDatesDto = fixture.patchExcludedDatesDto;
	const patchAvailableDatesDto = fixture.patchAvailableDatesDto;

	const experienceId = 'exp-uuid-001';

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [
				ExperiencePricesController,
				ExperienceAvailabilityController,
			],
			providers: [
				{
					provide: UpdatePriceByAgeGroupUseCase,
					useValue: {
						handle: jest.fn().mockResolvedValue(mockPricesAfterAdultsPatch),
					},
				},
				{
					provide: UpdateExcludedDatesUseCase,
					useValue: {
						handle: jest
							.fn()
							.mockResolvedValue(mockAvailabilityAfterExcludedPatch),
					},
				},
				{
					provide: UpdateAvailableDatesUseCase,
					useValue: {
						handle: jest
							.fn()
							.mockResolvedValue(mockAvailabilityAfterAvailablePatch),
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

		updatePriceByAgeGroupUseCase =
			moduleFixture.get<UpdatePriceByAgeGroupUseCase>(
				UpdatePriceByAgeGroupUseCase,
			);
		updateExcludedDatesUseCase = moduleFixture.get<UpdateExcludedDatesUseCase>(
			UpdateExcludedDatesUseCase,
		);
		updateAvailableDatesUseCase =
			moduleFixture.get<UpdateAvailableDatesUseCase>(
				UpdateAvailableDatesUseCase,
			);
	});

	afterAll(async () => {
		await app.close();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	// ─── PATCH /experiences/:experienceId/prices/age-group ──────────

	describe('PATCH /experiences/:experienceId/prices/age-group', () => {
		const url = `/experiences/${experienceId}/prices/age-group`;

		it('should update the ADULTS price and return updated prices', async () => {
			jest
				.spyOn(updatePriceByAgeGroupUseCase, 'handle')
				.mockResolvedValueOnce(mockPricesAfterAdultsPatch);

			const response = await request(app.getHttpServer())
				.patch(url)
				.send(patchAdultsPriceDto)
				.expect(HttpStatus.OK);

			expect(response.body).toHaveProperty('id', mockPrices.id);
			expect(response.body).toHaveProperty('ageGroups');
			expect(Array.isArray(response.body.ageGroups)).toBe(true);

			const adultsGroup = response.body.ageGroups.find(
				(g: { code: string }) => g.code === 'ADULTS',
			);
			expect(adultsGroup).toBeDefined();
			expect(adultsGroup.price).toBe(150);
		});

		it('should update the CHILD price without affecting other age groups', async () => {
			jest
				.spyOn(updatePriceByAgeGroupUseCase, 'handle')
				.mockResolvedValueOnce(mockPricesAfterChildPatch);

			const response = await request(app.getHttpServer())
				.patch(url)
				.send(patchChildPriceDto)
				.expect(HttpStatus.OK);

			const childGroup = response.body.ageGroups.find(
				(g: { code: string }) => g.code === 'CHILD',
			);
			expect(childGroup.price).toBe(25);

			const adultsGroup = response.body.ageGroups.find(
				(g: { code: string }) => g.code === 'ADULTS',
			);
			expect(adultsGroup.price).toBe(120);
		});

		it('should call the use case with experienceId and dto', async () => {
			const spy = jest.spyOn(updatePriceByAgeGroupUseCase, 'handle');

			await request(app.getHttpServer())
				.patch(url)
				.send(patchAdultsPriceDto)
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith(
				experienceId,
				expect.objectContaining({
					code: patchAdultsPriceDto.code,
					price: patchAdultsPriceDto.price,
				}),
			);
		});

		it('should return 400 when code is missing', () => {
			return request(app.getHttpServer())
				.patch(url)
				.send({ price: 150 })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when price is missing', () => {
			return request(app.getHttpServer())
				.patch(url)
				.send({ code: 'ADULTS' })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when code is not a valid AgeGroupCode', () => {
			return request(app.getHttpServer())
				.patch(url)
				.send({ code: 'ELDERLY', price: 50 })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when price is negative', () => {
			return request(app.getHttpServer())
				.patch(url)
				.send({ code: 'ADULTS', price: -10 })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when price is not a number', () => {
			return request(app.getHttpServer())
				.patch(url)
				.send({ code: 'ADULTS', price: 'cien' })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when extra unknown fields are sent', () => {
			return request(app.getHttpServer())
				.patch(url)
				.send({ code: 'ADULTS', price: 150, label: 'hackeando' })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should allow price of 0 (free experiences)', async () => {
			jest.spyOn(updatePriceByAgeGroupUseCase, 'handle').mockResolvedValueOnce({
				...mockPrices,
				ageGroups: mockPrices.ageGroups.map((g) =>
					g.code === 'CHILD' ? { ...g, price: 0 } : g,
				),
			});

			await request(app.getHttpServer())
				.patch(url)
				.send({ code: 'CHILD', price: 0 })
				.expect(HttpStatus.OK);
		});
	});

	// ─── PATCH /experiences/:experienceId/availability/excluded-dates ─

	describe('PATCH /experiences/:experienceId/availability/excluded-dates', () => {
		const url = `/experiences/${experienceId}/availability/excluded-dates`;

		it('should replace excluded dates and return updated availability', async () => {
			jest
				.spyOn(updateExcludedDatesUseCase, 'handle')
				.mockResolvedValueOnce(mockAvailabilityAfterExcludedPatch);

			const response = await request(app.getHttpServer())
				.patch(url)
				.send(patchExcludedDatesDto)
				.expect(HttpStatus.OK);

			expect(response.body).toHaveProperty('id', mockAvailability.id);
			expect(response.body).toHaveProperty('excludedDates');
			expect(Array.isArray(response.body.excludedDates)).toBe(true);
			expect(response.body.excludedDates).toHaveLength(3);
		});

		it('should call the use case with experienceId and dto', async () => {
			const spy = jest.spyOn(updateExcludedDatesUseCase, 'handle');

			await request(app.getHttpServer())
				.patch(url)
				.send(patchExcludedDatesDto)
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith(
				experienceId,
				expect.objectContaining({
					excludedDates: patchExcludedDatesDto.excludedDates,
				}),
			);
		});

		it('should not modify weeklyStartDays or specificAvailableStartDates', async () => {
			jest
				.spyOn(updateExcludedDatesUseCase, 'handle')
				.mockResolvedValueOnce(mockAvailabilityAfterExcludedPatch);

			const response = await request(app.getHttpServer())
				.patch(url)
				.send(patchExcludedDatesDto)
				.expect(HttpStatus.OK);

			expect(response.body).toHaveProperty('weeklyStartDays');
			expect(response.body).toHaveProperty('specificAvailableStartDates');
			expect(response.body.weeklyStartDays).toEqual([1, 3, 5]);
		});

		it('should allow sending an empty array to clear all excluded dates', async () => {
			jest
				.spyOn(updateExcludedDatesUseCase, 'handle')
				.mockResolvedValueOnce({ ...mockAvailability, excludedDates: [] });

			const response = await request(app.getHttpServer())
				.patch(url)
				.send({ excludedDates: [] })
				.expect(HttpStatus.OK);

			expect(response.body.excludedDates).toHaveLength(0);
		});

		it('should return 400 when excludedDates is missing', () => {
			return request(app.getHttpServer())
				.patch(url)
				.send({})
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when excludedDates contains an invalid date string', () => {
			return request(app.getHttpServer())
				.patch(url)
				.send({ excludedDates: ['not-a-date', '2026-12-25'] })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when excludedDates is not an array', () => {
			return request(app.getHttpServer())
				.patch(url)
				.send({ excludedDates: '2026-12-25' })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when extra unknown fields are sent', () => {
			return request(app.getHttpServer())
				.patch(url)
				.send({ excludedDates: ['2026-12-25'], weeklyStartDays: [1] })
				.expect(HttpStatus.BAD_REQUEST);
		});
	});

	// ─── PATCH /experiences/:experienceId/availability/available-dates ─

	describe('PATCH /experiences/:experienceId/availability/available-dates', () => {
		const url = `/experiences/${experienceId}/availability/available-dates`;

		it('should replace available dates and return updated availability', async () => {
			jest
				.spyOn(updateAvailableDatesUseCase, 'handle')
				.mockResolvedValueOnce(mockAvailabilityAfterAvailablePatch);

			const response = await request(app.getHttpServer())
				.patch(url)
				.send(patchAvailableDatesDto)
				.expect(HttpStatus.OK);

			expect(response.body).toHaveProperty('id', mockAvailability.id);
			expect(response.body).toHaveProperty('specificAvailableStartDates');
			expect(Array.isArray(response.body.specificAvailableStartDates)).toBe(
				true,
			);
			expect(response.body.specificAvailableStartDates).toHaveLength(3);
		});

		it('should call the use case with experienceId and dto', async () => {
			const spy = jest.spyOn(updateAvailableDatesUseCase, 'handle');

			await request(app.getHttpServer())
				.patch(url)
				.send(patchAvailableDatesDto)
				.expect(HttpStatus.OK);

			expect(spy).toHaveBeenCalledWith(
				experienceId,
				expect.objectContaining({
					specificAvailableStartDates:
						patchAvailableDatesDto.specificAvailableStartDates,
				}),
			);
		});

		it('should not modify excludedDates or weeklyStartDays', async () => {
			jest
				.spyOn(updateAvailableDatesUseCase, 'handle')
				.mockResolvedValueOnce(mockAvailabilityAfterAvailablePatch);

			const response = await request(app.getHttpServer())
				.patch(url)
				.send(patchAvailableDatesDto)
				.expect(HttpStatus.OK);

			expect(response.body).toHaveProperty('weeklyStartDays');
			expect(response.body).toHaveProperty('excludedDates');
			expect(response.body.weeklyStartDays).toEqual([1, 3, 5]);
		});

		it('should allow sending an empty array to clear all specific dates', async () => {
			jest.spyOn(updateAvailableDatesUseCase, 'handle').mockResolvedValueOnce({
				...mockAvailability,
				specificAvailableStartDates: [],
			});

			const response = await request(app.getHttpServer())
				.patch(url)
				.send({ specificAvailableStartDates: [] })
				.expect(HttpStatus.OK);

			expect(response.body.specificAvailableStartDates).toHaveLength(0);
		});

		it('should return 400 when specificAvailableStartDates is missing', () => {
			return request(app.getHttpServer())
				.patch(url)
				.send({})
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when specificAvailableStartDates contains an invalid date string', () => {
			return request(app.getHttpServer())
				.patch(url)
				.send({ specificAvailableStartDates: ['2026-04-01', 'no-es-fecha'] })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when specificAvailableStartDates is not an array', () => {
			return request(app.getHttpServer())
				.patch(url)
				.send({ specificAvailableStartDates: '2026-04-01' })
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when extra unknown fields are sent', () => {
			return request(app.getHttpServer())
				.patch(url)
				.send({
					specificAvailableStartDates: ['2026-04-01'],
					excludedDates: ['2026-12-25'],
				})
				.expect(HttpStatus.BAD_REQUEST);
		});
	});
});
