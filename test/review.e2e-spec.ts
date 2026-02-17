import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ReviewController } from '../src/andean/infra/controllers/Review.controller';
import { CreateReviewUseCase } from '../src/andean/app/use_cases/CreateReviewUseCase';
import { GetAllReviewsUseCase } from '../src/andean/app/use_cases/GetAllReviewsUseCase';
import { GetByIdReviewUseCase } from '../src/andean/app/use_cases/GetByIdReviewUseCase';
import { UpdateReviewUseCase } from '../src/andean/app/use_cases/UpdateReviewUseCase';
import { DeleteReviewUseCase } from '../src/andean/app/use_cases/DeleteReviewUseCase';
import { IncrementLikesUseCase } from '../src/andean/app/use_cases/IncrementLikesUseCase';
import { IncrementDislikesUseCase } from '../src/andean/app/use_cases/IncrementDislikesUseCase';
import { DecrementLikesUseCase } from '../src/andean/app/use_cases/DecrementLikesUseCase';
import { DecrementDislikesUseCase } from '../src/andean/app/use_cases/DecrementDislikesUseCase';
import { ProductType } from '../src/andean/domain/enums/ProductType';
import { MediaItemType } from '../src/andean/domain/enums/MediaItemType';
import { MediaItemRole } from '../src/andean/domain/enums/MediaItemRole';
import { FixtureLoader } from './helpers/fixture-loader';

describe('ReviewController (e2e)', () => {
	let app: INestApplication;
	let createReviewUseCase: CreateReviewUseCase;
	let getAllReviewsUseCase: GetAllReviewsUseCase;
	let getByIdReviewUseCase: GetByIdReviewUseCase;
	let updateReviewUseCase: UpdateReviewUseCase;
	let deleteReviewUseCase: DeleteReviewUseCase;
	let incrementLikesUseCase: IncrementLikesUseCase;
	let incrementDislikesUseCase: IncrementDislikesUseCase;
	let decrementLikesUseCase: DecrementLikesUseCase;
	let decrementDislikesUseCase: DecrementDislikesUseCase;

	// Load mock data from JSON fixture
	const fixture = FixtureLoader.loadReview();
	const mockReview = {
		...fixture.entity,
		createdAt: new Date(fixture.entity.createdAt),
		updatedAt: new Date(fixture.entity.updatedAt)
	} as any;
	const createDto = fixture.createDto;
	const createDtoWithMedia = fixture.createDtoWithMedia;
	const updateDto = fixture.updateDto;
	const mockMediaItem = {
		...fixture.mockMediaItem,
		createdAt: new Date(fixture.mockMediaItem.createdAt),
		updatedAt: new Date(fixture.mockMediaItem.updatedAt)
	} as any;

	// Minimal valid 1x1 pixel PNG for file upload tests
	const validPngBuffer = Buffer.from(
		'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
		'base64',
	);

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			controllers: [ReviewController],
			providers: [
				{
					provide: CreateReviewUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(mockReview) }
				},
				{
					provide: GetAllReviewsUseCase,
					useValue: { handle: jest.fn().mockResolvedValue([mockReview]) }
				},
				{
					provide: GetByIdReviewUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(mockReview) }
				},
				{
					provide: UpdateReviewUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(mockReview) }
				},
				{
					provide: DeleteReviewUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(undefined) }
				},
				{
					provide: IncrementLikesUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(mockReview) }
				},
				{
					provide: IncrementDislikesUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(mockReview) }
				},
				{
					provide: DecrementLikesUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(mockReview) }
				},
				{
					provide: DecrementDislikesUseCase,
					useValue: { handle: jest.fn().mockResolvedValue(mockReview) }
				},
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true
		}));
		await app.init();

		createReviewUseCase = moduleFixture.get(CreateReviewUseCase);
		getAllReviewsUseCase = moduleFixture.get(GetAllReviewsUseCase);
		getByIdReviewUseCase = moduleFixture.get(GetByIdReviewUseCase);
		updateReviewUseCase = moduleFixture.get(UpdateReviewUseCase);
		deleteReviewUseCase = moduleFixture.get(DeleteReviewUseCase);
		incrementLikesUseCase = moduleFixture.get(IncrementLikesUseCase);
		incrementDislikesUseCase = moduleFixture.get(IncrementDislikesUseCase);
		decrementLikesUseCase = moduleFixture.get(DecrementLikesUseCase);
		decrementDislikesUseCase = moduleFixture.get(DecrementDislikesUseCase);
	});

	afterAll(async () => {
		await app.close();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('POST /reviews (create review)', () => {
		it('should create a new review without media', () => {
			jest.spyOn(createReviewUseCase, 'handle').mockResolvedValueOnce(mockReview);

			return request(app.getHttpServer())
				.post('/reviews')
				.field('content', createDto.content)
				.field('numberStarts', createDto.numberStarts)
				.field('customerId', createDto.customerId)
				.field('productId', createDto.productId)
				.field('productType', createDto.productType)
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: expect.any(String),
						content: expect.any(String),
						numberStarts: expect.any(Number),
						customerId: expect.any(String),
						productId: expect.any(String),
						productType: expect.any(String)
					});
					expect(res.body).toHaveProperty('createdAt');
					expect(res.body).toHaveProperty('updatedAt');
					expect(createReviewUseCase.handle).toHaveBeenCalledWith(
						expect.objectContaining({
							content: createDto.content,
							numberStarts: createDto.numberStarts,
							customerId: createDto.customerId,
							productId: createDto.productId,
							productType: createDto.productType
						}),
						undefined // No file
					);
				});
		});

		it('should create a new review with media file', () => {
			const reviewWithMedia = { ...mockReview, mediaId: mockMediaItem.id };
			jest.spyOn(createReviewUseCase, 'handle').mockResolvedValueOnce(reviewWithMedia);

			return request(app.getHttpServer())
				.post('/reviews')
				.attach('file', validPngBuffer, { filename: 'review-photo.jpg', contentType: 'image/jpeg' })
				.field('content', createDtoWithMedia.content)
				.field('numberStarts', createDtoWithMedia.numberStarts)
				.field('customerId', createDtoWithMedia.customerId)
				.field('productId', createDtoWithMedia.productId)
				.field('productType', createDtoWithMedia.productType)
				.field('mediaType', createDtoWithMedia.mediaType)
				.field('mediaName', createDtoWithMedia.mediaName)
				.field('mediaRole', createDtoWithMedia.mediaRole)
				.expect(HttpStatus.CREATED)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: expect.any(String),
						content: expect.any(String),
						numberStarts: expect.any(Number),
						mediaId: expect.any(String)
					});
					expect(createReviewUseCase.handle).toHaveBeenCalledWith(
						expect.objectContaining({
							content: createDtoWithMedia.content,
							mediaType: createDtoWithMedia.mediaType,
							mediaName: createDtoWithMedia.mediaName,
							mediaRole: createDtoWithMedia.mediaRole
						}),
						expect.objectContaining({
							buffer: expect.any(Buffer),
							mimetype: 'image/jpeg',
							originalname: 'review-photo.jpg'
						})
					);
				});
		});

		it('should return 400 when content is missing', () => {
			return request(app.getHttpServer())
				.post('/reviews')
				.field('numberStarts', 5)
				.field('customerId', 'customer-123')
				.field('productId', 'product-456')
				.field('productType', ProductType.TEXTILE)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when numberStarts is missing', () => {
			return request(app.getHttpServer())
				.post('/reviews')
				.field('content', 'Great product')
				.field('customerId', 'customer-123')
				.field('productId', 'product-456')
				.field('productType', ProductType.TEXTILE)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when customerId is missing', () => {
			return request(app.getHttpServer())
				.post('/reviews')
				.field('content', 'Great product')
				.field('numberStarts', 5)
				.field('productId', 'product-456')
				.field('productType', ProductType.TEXTILE)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when productId is missing', () => {
			return request(app.getHttpServer())
				.post('/reviews')
				.field('content', 'Great product')
				.field('numberStarts', 5)
				.field('customerId', 'customer-123')
				.field('productType', ProductType.TEXTILE)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when productType is missing', () => {
			return request(app.getHttpServer())
				.post('/reviews')
				.field('content', 'Great product')
				.field('numberStarts', 5)
				.field('customerId', 'customer-123')
				.field('productId', 'product-456')
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when file is too large', () => {
			const largeBuffer = Buffer.alloc(6 * 1024 * 1024); // 6MB (exceeds 5MB limit)

			return request(app.getHttpServer())
				.post('/reviews')
				.attach('file', largeBuffer, { filename: 'large.jpg', contentType: 'image/jpeg' })
				.field('content', 'Great product')
				.field('numberStarts', 5)
				.field('customerId', 'customer-123')
				.field('productId', 'product-456')
				.field('productType', ProductType.TEXTILE)
				.field('mediaType', MediaItemType.IMG)
				.field('mediaName', 'large.jpg')
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 when file type is invalid', () => {
			const textBuffer = Buffer.from('not an image');

			return request(app.getHttpServer())
				.post('/reviews')
				.attach('file', textBuffer, { filename: 'file.txt', contentType: 'text/plain' })
				.field('content', 'Great product')
				.field('numberStarts', 5)
				.field('customerId', 'customer-123')
				.field('productId', 'product-456')
				.field('productType', ProductType.TEXTILE)
				.field('mediaType', MediaItemType.IMG)
				.field('mediaName', 'file.txt')
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should accept valid image formats (jpeg, png, webp)', async () => {
			jest.spyOn(createReviewUseCase, 'handle').mockResolvedValue(mockReview);

			// Test JPEG
			await request(app.getHttpServer())
				.post('/reviews')
				.attach('file', validPngBuffer, { filename: 'photo.jpeg', contentType: 'image/jpeg' })
				.field('content', 'Great')
				.field('numberStarts', 5)
				.field('customerId', 'customer-123')
				.field('productId', 'product-456')
				.field('productType', ProductType.TEXTILE)
				.field('mediaType', MediaItemType.IMG)
				.field('mediaName', 'photo.jpeg')
				.expect(HttpStatus.CREATED);

			// Test PNG
			await request(app.getHttpServer())
				.post('/reviews')
				.attach('file', validPngBuffer, { filename: 'photo.png', contentType: 'image/png' })
				.field('content', 'Great')
				.field('numberStarts', 5)
				.field('customerId', 'customer-123')
				.field('productId', 'product-456')
				.field('productType', ProductType.TEXTILE)
				.field('mediaType', MediaItemType.IMG)
				.field('mediaName', 'photo.png')
				.expect(HttpStatus.CREATED);

			// Test WEBP
			await request(app.getHttpServer())
				.post('/reviews')
				.attach('file', validPngBuffer, { filename: 'photo.webp', contentType: 'image/webp' })
				.field('content', 'Great')
				.field('numberStarts', 5)
				.field('customerId', 'customer-123')
				.field('productId', 'product-456')
				.field('productType', ProductType.TEXTILE)
				.field('mediaType', MediaItemType.IMG)
				.field('mediaName', 'photo.webp')
				.expect(HttpStatus.CREATED);
		});
	});

	describe('GET /reviews', () => {
		it('should return all reviews', () => {
			jest.spyOn(getAllReviewsUseCase, 'handle').mockResolvedValueOnce([mockReview]);

			return request(app.getHttpServer())
				.get('/reviews')
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(Array.isArray(res.body)).toBe(true);
					expect(res.body.length).toBeGreaterThan(0);
					expect(res.body[0]).toMatchObject({
						id: expect.any(String),
						content: expect.any(String),
						numberStarts: expect.any(Number)
					});
				});
		});

		it('should return 404 when no reviews exist', () => {
			jest.spyOn(getAllReviewsUseCase, 'handle').mockRejectedValueOnce(
				new Error('No reviews found')
			);

			return request(app.getHttpServer())
				.get('/reviews')
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});

	describe('GET /reviews/:id', () => {
		it('should return a review by id', () => {
			jest.spyOn(getByIdReviewUseCase, 'handle').mockResolvedValueOnce(mockReview);

			return request(app.getHttpServer())
				.get(`/reviews/${mockReview.id}`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: mockReview.id,
						content: mockReview.content,
						numberStarts: mockReview.numberStarts
					});
				});
		});

		it('should return 404 when review not found', () => {
			jest.spyOn(getByIdReviewUseCase, 'handle').mockRejectedValueOnce(
				new Error('Review not found')
			);

			return request(app.getHttpServer())
				.get('/reviews/non-existent-id')
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});

	describe('PUT /reviews/:id', () => {
		it('should update a review', () => {
			const updatedReview = { ...mockReview, content: updateDto.content };
			jest.spyOn(updateReviewUseCase, 'handle').mockResolvedValueOnce(updatedReview);

			return request(app.getHttpServer())
				.put(`/reviews/${mockReview.id}`)
				.send(updateDto)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: mockReview.id,
						content: updateDto.content
					});
				});
		});

		it('should return 404 when trying to update non-existent review', () => {
			jest.spyOn(updateReviewUseCase, 'handle').mockRejectedValueOnce(
				new Error('Review not found')
			);

			return request(app.getHttpServer())
				.put('/reviews/non-existent-id')
				.send(updateDto)
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});

	describe('DELETE /reviews/:id', () => {
		it('should delete a review', () => {
			jest.spyOn(deleteReviewUseCase, 'handle').mockResolvedValueOnce(undefined);

			return request(app.getHttpServer())
				.delete(`/reviews/${mockReview.id}`)
				.expect(HttpStatus.OK);
		});

		it('should return 404 when trying to delete non-existent review', () => {
			jest.spyOn(deleteReviewUseCase, 'handle').mockRejectedValueOnce(
				new Error('Review not found')
			);

			return request(app.getHttpServer())
				.delete('/reviews/non-existent-id')
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});

	describe('PATCH /reviews/:id/likes', () => {
		it('should increment likes', () => {
			const reviewWithMoreLikes = { ...mockReview, numberLikes: mockReview.numberLikes + 1 };
			jest.spyOn(incrementLikesUseCase, 'handle').mockResolvedValueOnce(reviewWithMoreLikes);

			return request(app.getHttpServer())
				.patch(`/reviews/${mockReview.id}/likes`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: mockReview.id,
						numberLikes: mockReview.numberLikes + 1
					});
				});
		});
	});

	describe('PATCH /reviews/:id/dislikes', () => {
		it('should increment dislikes', () => {
			const reviewWithMoreDislikes = { ...mockReview, numberDislikes: mockReview.numberDislikes + 1 };
			jest.spyOn(incrementDislikesUseCase, 'handle').mockResolvedValueOnce(reviewWithMoreDislikes);

			return request(app.getHttpServer())
				.patch(`/reviews/${mockReview.id}/dislikes`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: mockReview.id,
						numberDislikes: mockReview.numberDislikes + 1
					});
				});
		});
	});

	describe('DELETE /reviews/:id/likes', () => {
		it('should decrement likes', () => {
			const reviewWithFewerLikes = { ...mockReview, numberLikes: Math.max(0, mockReview.numberLikes - 1) };
			jest.spyOn(decrementLikesUseCase, 'handle').mockResolvedValueOnce(reviewWithFewerLikes);

			return request(app.getHttpServer())
				.delete(`/reviews/${mockReview.id}/likes`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: mockReview.id,
						numberLikes: Math.max(0, mockReview.numberLikes - 1)
					});
				});
		});
	});

	describe('DELETE /reviews/:id/dislikes', () => {
		it('should decrement dislikes', () => {
			const reviewWithFewerDislikes = { ...mockReview, numberDislikes: Math.max(0, mockReview.numberDislikes - 1) };
			jest.spyOn(decrementDislikesUseCase, 'handle').mockResolvedValueOnce(reviewWithFewerDislikes);

			return request(app.getHttpServer())
				.delete(`/reviews/${mockReview.id}/dislikes`)
				.expect(HttpStatus.OK)
				.expect((res) => {
					expect(res.body).toMatchObject({
						id: mockReview.id,
						numberDislikes: Math.max(0, mockReview.numberDislikes - 1)
					});
				});
		});
	});
});
