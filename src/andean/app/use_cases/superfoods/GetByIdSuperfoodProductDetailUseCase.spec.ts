import { GetByIdSuperfoodProductDetailUseCase } from './GetByIdSuperfoodProductDetailUseCase';
import { Review } from '../../../domain/entities/Review';
import { ProductType } from '../../../domain/enums/ProductType';

describe('GetByIdSuperfoodProductDetailUseCase - userVote mapping', () => {
	let useCase: GetByIdSuperfoodProductDetailUseCase;
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
		useCase = new GetByIdSuperfoodProductDetailUseCase(
			{} as any, // superfoodProductRepository
			{} as any, // superfoodBenefitRepository
			{} as any, // superfoodNutritionalFeatureRepository
			mockReviewRepository,
			{} as any, // customerProfileRepository
			mockAccountRepository,
			{} as any, // shopRepository
			{} as any, // communityRepository
			{} as any, // mediaItemRepository
			{} as any, // detailSourceProductRepository
			{ getByProductId: jest.fn().mockResolvedValue([]) } as any, // variantRepository
			{ getByIds: jest.fn().mockResolvedValue([]) } as any, // sizeOptionAlternativeRepository
			{} as any, // mediaUrlResolver
			{} as any, // ownerInfoResolver
			{} as any, // superfoodProductListColorResolver
			{} as any, // superfoodProductListMediaResolver
		);
	});

	const createMockReview = (
		id: string,
		likedBy?: string[],
		dislikedBy?: string[],
	): Review => {
		return new Review(
			id,
			'Excellent superfood!',
			5,
			'account-789',
			'product-999',
			ProductType.SUPERFOOD,
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
		it('should set userVote to null when userId is undefined (task 4.8)', async () => {
			const review = createMockReview('review-1', ['user-1'], ['user-2']);
			mockReviewRepository.getByProductIdAndType.mockResolvedValue([review]);

			// Mock superfoodProductRepository to return a valid product
			(useCase as any).superfoodProductRepository = {
				getSuperfoodProductById: jest.fn().mockResolvedValue({
					id: 'product-1',
					status: 'PUBLISHED',
					baseInfo: { productMedia: {}, nutritional_features: [], benefits: [] },
					priceInventory: { basePrice: 10, totalStock: 100 },
					isDiscountActive: false,
					options: [],
				}),
			};
			(useCase as any).superfoodBenefitRepository = {
				getByIds: jest.fn().mockResolvedValue([]),
			};
			(useCase as any).superfoodNutritionalFeatureRepository = {
				getByIds: jest.fn().mockResolvedValue([]),
			};
			(useCase as any).mediaItemRepository = {
				getByIds: jest.fn().mockResolvedValue([]),
			};
			(useCase as any).mediaUrlResolver = {
				resolveUrls: jest.fn().mockResolvedValue(new Map()),
			};
			(useCase as any).ownerInfoResolver = {
				resolveDetailed: jest.fn().mockResolvedValue(undefined),
			};
			(useCase as any).superfoodProductListColorResolver = {
				resolveById: jest.fn().mockResolvedValue(undefined),
			};
			(useCase as any).superfoodProductRepository.getAllWithFilters = jest
				.fn()
				.mockResolvedValue({ products: [] });
			(useCase as any).superfoodProductListMediaResolver.attachListMediaFromAggregate =
				jest.fn().mockResolvedValue([]);
			(useCase as any).superfoodProductListColorResolver.attachCatalogColorFromAggregate =
				jest.fn().mockResolvedValue([]);

			const result = await useCase.handle('product-1', undefined);

			expect(result.reviews.comments[0].userVote).toBeUndefined();
		});

		it('should set userVote to "like" when userId exists in likedBy array (task 4.9)', async () => {
			const review = createMockReview('review-1', ['user-456'], []);
			mockReviewRepository.getByProductIdAndType.mockResolvedValue([review]);

			(useCase as any).superfoodProductRepository = {
				getSuperfoodProductById: jest.fn().mockResolvedValue({
					id: 'product-1',
					status: 'PUBLISHED',
					baseInfo: { productMedia: {}, nutritional_features: [], benefits: [] },
					priceInventory: { basePrice: 10, totalStock: 100 },
					isDiscountActive: false,
					options: [],
				}),
				getAllWithFilters: jest.fn().mockResolvedValue({ products: [] }),
			};
			(useCase as any).superfoodBenefitRepository = {
				getByIds: jest.fn().mockResolvedValue([]),
			};
			(useCase as any).superfoodNutritionalFeatureRepository = {
				getByIds: jest.fn().mockResolvedValue([]),
			};
			(useCase as any).mediaItemRepository = {
				getByIds: jest.fn().mockResolvedValue([]),
			};
			(useCase as any).mediaUrlResolver = {
				resolveUrls: jest.fn().mockResolvedValue(new Map()),
			};
			(useCase as any).ownerInfoResolver = {
				resolveDetailed: jest.fn().mockResolvedValue(undefined),
			};
			(useCase as any).superfoodProductListColorResolver = {
				resolveById: jest.fn().mockResolvedValue(undefined),
				attachCatalogColorFromAggregate: jest.fn().mockResolvedValue([]),
			};
			(useCase as any).superfoodProductListMediaResolver = {
				attachListMediaFromAggregate: jest.fn().mockResolvedValue([]),
			};

			const result = await useCase.handle('product-1', 'user-456');

			expect(result.reviews.comments[0].userVote).toBe('like');
		});

		it('should set userVote to "dislike" when userId exists in dislikedBy array (task 4.10)', async () => {
			const review = createMockReview('review-1', [], ['user-456']);
			mockReviewRepository.getByProductIdAndType.mockResolvedValue([review]);

			(useCase as any).superfoodProductRepository = {
				getSuperfoodProductById: jest.fn().mockResolvedValue({
					id: 'product-1',
					status: 'PUBLISHED',
					baseInfo: { productMedia: {}, nutritional_features: [], benefits: [] },
					priceInventory: { basePrice: 10, totalStock: 100 },
					isDiscountActive: false,
					options: [],
				}),
				getAllWithFilters: jest.fn().mockResolvedValue({ products: [] }),
			};
			(useCase as any).superfoodBenefitRepository = {
				getByIds: jest.fn().mockResolvedValue([]),
			};
			(useCase as any).superfoodNutritionalFeatureRepository = {
				getByIds: jest.fn().mockResolvedValue([]),
			};
			(useCase as any).mediaItemRepository = {
				getByIds: jest.fn().mockResolvedValue([]),
			};
			(useCase as any).mediaUrlResolver = {
				resolveUrls: jest.fn().mockResolvedValue(new Map()),
			};
			(useCase as any).ownerInfoResolver = {
				resolveDetailed: jest.fn().mockResolvedValue(undefined),
			};
			(useCase as any).superfoodProductListColorResolver = {
				resolveById: jest.fn().mockResolvedValue(undefined),
				attachCatalogColorFromAggregate: jest.fn().mockResolvedValue([]),
			};
			(useCase as any).superfoodProductListMediaResolver = {
				attachListMediaFromAggregate: jest.fn().mockResolvedValue([]),
			};

			const result = await useCase.handle('product-1', 'user-456');

			expect(result.reviews.comments[0].userVote).toBe('dislike');
		});

		it('should set userVote to null when userId exists but not in either array (task 4.11)', async () => {
			const review = createMockReview('review-1', ['user-1'], ['user-2']);
			mockReviewRepository.getByProductIdAndType.mockResolvedValue([review]);

			(useCase as any).superfoodProductRepository = {
				getSuperfoodProductById: jest.fn().mockResolvedValue({
					id: 'product-1',
					status: 'PUBLISHED',
					baseInfo: { productMedia: {}, nutritional_features: [], benefits: [] },
					priceInventory: { basePrice: 10, totalStock: 100 },
					isDiscountActive: false,
					options: [],
				}),
				getAllWithFilters: jest.fn().mockResolvedValue({ products: [] }),
			};
			(useCase as any).superfoodBenefitRepository = {
				getByIds: jest.fn().mockResolvedValue([]),
			};
			(useCase as any).superfoodNutritionalFeatureRepository = {
				getByIds: jest.fn().mockResolvedValue([]),
			};
			(useCase as any).mediaItemRepository = {
				getByIds: jest.fn().mockResolvedValue([]),
			};
			(useCase as any).mediaUrlResolver = {
				resolveUrls: jest.fn().mockResolvedValue(new Map()),
			};
			(useCase as any).ownerInfoResolver = {
				resolveDetailed: jest.fn().mockResolvedValue(undefined),
			};
			(useCase as any).superfoodProductListColorResolver = {
				resolveById: jest.fn().mockResolvedValue(undefined),
				attachCatalogColorFromAggregate: jest.fn().mockResolvedValue([]),
			};
			(useCase as any).superfoodProductListMediaResolver = {
				attachListMediaFromAggregate: jest.fn().mockResolvedValue([]),
			};

			const result = await useCase.handle('product-1', 'user-456');

			expect(result.reviews.comments[0].userVote).toBe(null);
		});
	});

	describe('hero variants mapping', () => {
		function mockCommonDeps() {
			(useCase as any).superfoodBenefitRepository = {
				getByIds: jest.fn().mockResolvedValue([]),
			};
			(useCase as any).superfoodNutritionalFeatureRepository = {
				getByIds: jest.fn().mockResolvedValue([]),
			};
			(useCase as any).mediaItemRepository = {
				getByIds: jest.fn().mockResolvedValue([]),
			};
			(useCase as any).mediaUrlResolver = {
				resolveUrls: jest.fn().mockResolvedValue(new Map()),
			};
			(useCase as any).ownerInfoResolver = {
				resolveDetailed: jest.fn().mockResolvedValue(undefined),
			};
			(useCase as any).superfoodProductListColorResolver = {
				resolveById: jest.fn().mockResolvedValue(undefined),
				attachCatalogColorFromAggregate: jest.fn().mockResolvedValue([]),
			};
			(useCase as any).superfoodProductListMediaResolver = {
				attachListMediaFromAggregate: jest.fn().mockResolvedValue([]),
			};
			(useCase as any).reviewRepository.getByProductIdAndType.mockResolvedValue(
				[],
			);
		}

		it('joins Variant entities with SIZE option labels', async () => {
			mockCommonDeps();
			(useCase as any).superfoodProductRepository = {
				getSuperfoodProductById: jest.fn().mockResolvedValue({
					id: 'product-1',
					status: 'PUBLISHED',
					baseInfo: { productMedia: {}, nutritional_features: [], benefits: [] },
					priceInventory: { basePrice: 10, totalStock: 100 },
					isDiscountActive: false,
					options: [
						{
							name: 'SIZE',
							values: [
								{ label: '500 g', idOptionAlternative: 'alt-500' },
								{ label: '1 kg', idOptionAlternative: 'alt-1kg' },
							],
						},
					],
				}),
				getAllWithFilters: jest.fn().mockResolvedValue({ products: [] }),
			};
			(useCase as any).variantRepository = {
				getByProductId: jest.fn().mockResolvedValue([
					{
						id: 'var-500',
						productType: ProductType.SUPERFOOD,
						combination: { SIZE: 'alt-500' },
						price: 30,
						stock: 8,
						sku: 'SKU-500',
					},
					{
						id: 'var-1kg',
						productType: ProductType.SUPERFOOD,
						combination: { SIZE: 'alt-1kg' },
						price: 50,
						stock: 3,
						sku: 'SKU-1KG',
					},
				]),
			};

			const result = await useCase.handle('product-1');

			expect(result.variants).toEqual([
				{
					variantId: 'var-500',
					label: '500 g',
					price: 30,
					stock: 8,
					sku: 'SKU-500',
				},
				{
					variantId: 'var-1kg',
					label: '1 kg',
					price: 50,
					stock: 3,
					sku: 'SKU-1KG',
				},
			]);
		});
	});
});
