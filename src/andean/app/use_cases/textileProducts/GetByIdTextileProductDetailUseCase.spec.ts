import { GetByIdTextileProductDetailUseCase } from './GetByIdTextileProductDetailUseCase';
import { Review } from '../../../domain/entities/Review';
import { ProductType } from '../../../domain/enums/ProductType';

describe('GetByIdTextileProductDetailUseCase - userVote mapping', () => {
	let useCase: GetByIdTextileProductDetailUseCase;
	let mockReviewRepository: any;
	let mockAccountRepository: any;

	beforeEach(() => {
		// Mock repositories with minimal setup for userVote testing
		mockReviewRepository = {
			getByProductIdAndType: jest.fn(),
		};

		mockAccountRepository = {
			getAccountById: jest.fn().mockResolvedValue({ name: 'Test User' }),
		};

		// Create minimal use case instance with only required dependencies
		useCase = new GetByIdTextileProductDetailUseCase(
			{} as any, // textileProductRepository
			mockReviewRepository,
			{} as any, // customerProfileRepository
			{} as any, // communityRepository
			{} as any, // sealRepository
			{} as any, // textileCategoryRepository
			{} as any, // shopRepository
			{} as any, // variantRepository
			mockAccountRepository,
			{} as any, // mediaItemRepository
			{} as any, // mediaUrlResolver
			{} as any, // textileProductAttributesAssembler
			{} as any, // ownerInfoResolver
		);
	});

	const createMockReview = (
		id: string,
		likedBy?: string[],
		dislikedBy?: string[],
	): Review => {
		return new Review(
			id,
			'Great product!',
			5,
			'account-123',
			'product-456',
			ProductType.TEXTILE,
			likedBy?.length || 0,
			dislikedBy?.length || 0,
			new Date(),
			new Date(),
			undefined,
			likedBy,
			dislikedBy,
		);
	};

	describe('userVote field mapping', () => {
		it('should set userVote to null when userId is undefined (task 4.4)', async () => {
			const review = createMockReview('review-1', ['user-1'], ['user-2']);
			mockReviewRepository.getByProductIdAndType.mockResolvedValue([review]);

			// Mock textileProductRepository to return a valid product
			(useCase as any).textileProductRepository = {
				getTextileProductById: jest.fn().mockResolvedValue({
					id: 'product-1',
					baseInfo: { mediaIds: [], information: '', description: '' },
					priceInventary: { totalStock: 100, basePrice: 50 },
					discountInfo: { isDiscountActive: false },
				}),
				getAllTextileProducts: jest.fn().mockResolvedValue([]),
			};
			(useCase as any).variantRepository = {
				getByProductId: jest.fn().mockResolvedValue([]),
			};
			(useCase as any).mediaItemRepository = {
				getByIds: jest.fn().mockResolvedValue([]),
			};
			(useCase as any).mediaUrlResolver = {
				resolveUrls: jest.fn().mockResolvedValue(new Map()),
			};
			(useCase as any).textileProductAttributesAssembler = {
				buildForProduct: jest.fn().mockResolvedValue({ variantInfo: [] }),
			};
			(useCase as any).ownerInfoResolver = {
				resolveDetailed: jest.fn().mockResolvedValue(undefined),
			};

			const result = await useCase.handle('product-1', undefined);

			expect(result.reviews.comments[0].userVote).toBeUndefined();
		});

		it('should set userVote to "like" when userId exists in likedBy array (task 4.5)', async () => {
			const review = createMockReview('review-1', ['user-123'], []);
			mockReviewRepository.getByProductIdAndType.mockResolvedValue([review]);

			(useCase as any).textileProductRepository = {
				getTextileProductById: jest.fn().mockResolvedValue({
					id: 'product-1',
					baseInfo: { mediaIds: [], information: '', description: '' },
					priceInventary: { totalStock: 100, basePrice: 50 },
					discountInfo: { isDiscountActive: false },
				}),
				getAllTextileProducts: jest.fn().mockResolvedValue([]),
			};
			(useCase as any).variantRepository = {
				getByProductId: jest.fn().mockResolvedValue([]),
			};
			(useCase as any).mediaItemRepository = {
				getByIds: jest.fn().mockResolvedValue([]),
			};
			(useCase as any).mediaUrlResolver = {
				resolveUrls: jest.fn().mockResolvedValue(new Map()),
			};
			(useCase as any).textileProductAttributesAssembler = {
				buildForProduct: jest.fn().mockResolvedValue({ variantInfo: [] }),
			};
			(useCase as any).ownerInfoResolver = {
				resolveDetailed: jest.fn().mockResolvedValue(undefined),
			};

			const result = await useCase.handle('product-1', 'user-123');

			expect(result.reviews.comments[0].userVote).toBe('like');
		});

		it('should set userVote to "dislike" when userId exists in dislikedBy array (task 4.6)', async () => {
			const review = createMockReview('review-1', [], ['user-123']);
			mockReviewRepository.getByProductIdAndType.mockResolvedValue([review]);

			(useCase as any).textileProductRepository = {
				getTextileProductById: jest.fn().mockResolvedValue({
					id: 'product-1',
					baseInfo: { mediaIds: [], information: '', description: '' },
					priceInventary: { totalStock: 100, basePrice: 50 },
					discountInfo: { isDiscountActive: false },
				}),
				getAllTextileProducts: jest.fn().mockResolvedValue([]),
			};
			(useCase as any).variantRepository = {
				getByProductId: jest.fn().mockResolvedValue([]),
			};
			(useCase as any).mediaItemRepository = {
				getByIds: jest.fn().mockResolvedValue([]),
			};
			(useCase as any).mediaUrlResolver = {
				resolveUrls: jest.fn().mockResolvedValue(new Map()),
			};
			(useCase as any).textileProductAttributesAssembler = {
				buildForProduct: jest.fn().mockResolvedValue({ variantInfo: [] }),
			};
			(useCase as any).ownerInfoResolver = {
				resolveDetailed: jest.fn().mockResolvedValue(undefined),
			};

			const result = await useCase.handle('product-1', 'user-123');

			expect(result.reviews.comments[0].userVote).toBe('dislike');
		});

		it('should set userVote to null when userId exists but not in either array (task 4.7)', async () => {
			const review = createMockReview('review-1', ['user-1'], ['user-2']);
			mockReviewRepository.getByProductIdAndType.mockResolvedValue([review]);

			(useCase as any).textileProductRepository = {
				getTextileProductById: jest.fn().mockResolvedValue({
					id: 'product-1',
					baseInfo: { mediaIds: [], information: '', description: '' },
					priceInventary: { totalStock: 100, basePrice: 50 },
					discountInfo: { isDiscountActive: false },
				}),
				getAllTextileProducts: jest.fn().mockResolvedValue([]),
			};
			(useCase as any).variantRepository = {
				getByProductId: jest.fn().mockResolvedValue([]),
			};
			(useCase as any).mediaItemRepository = {
				getByIds: jest.fn().mockResolvedValue([]),
			};
			(useCase as any).mediaUrlResolver = {
				resolveUrls: jest.fn().mockResolvedValue(new Map()),
			};
			(useCase as any).textileProductAttributesAssembler = {
				buildForProduct: jest.fn().mockResolvedValue({ variantInfo: [] }),
			};
			(useCase as any).ownerInfoResolver = {
				resolveDetailed: jest.fn().mockResolvedValue(undefined),
			};

			const result = await useCase.handle('product-1', 'user-123');

			expect(result.reviews.comments[0].userVote).toBe(null);
		});
	});
});
