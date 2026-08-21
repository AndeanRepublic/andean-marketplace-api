import { NotFoundException } from '@nestjs/common';
import { applyPublishedStatusFilter } from '../src/andean/infra/utils/catalogVisibility';
import { TextileProductStatus } from '../src/andean/domain/enums/TextileProductStatus';
import { SuperfoodProductStatus } from '../src/andean/domain/enums/SuperfoodProductStatus';
import { GetAllTextileProductsForManagementUseCase } from '../src/andean/app/use_cases/textileProducts/GetAllTextileProductsForManagementUseCase';
import { GetAllSuperfoodProductsForManagementUseCase } from '../src/andean/app/use_cases/superfoods/GetAllSuperfoodProductsForManagementUseCase';
import { GetAllExperiencesForManagementUseCase } from '../src/andean/app/use_cases/experiences/GetAllExperiencesForManagementUseCase';
import { AccountRole } from '../src/andean/domain/enums/AccountRole';
import { GetByIdTextileProductDetailUseCase } from '../src/andean/app/use_cases/textileProducts/GetByIdTextileProductDetailUseCase';
import { GetBoxDetailUseCase } from '../src/andean/app/use_cases/boxes/GetBoxDetailUseCase';
import { AdminEntityStatus } from '../src/andean/domain/enums/AdminEntityStatus';
import { TextileProduct } from '../src/andean/domain/entities/textileProducts/TextileProduct';
import { Box } from '../src/andean/domain/entities/box/Box';

describe('catalogVisibility', () => {
	it('applyPublishedStatusFilter sets status when includeAllStatuses is not true', () => {
		const query: Record<string, unknown> = {};
		applyPublishedStatusFilter(
			query,
			undefined,
			TextileProductStatus.PUBLISHED,
		);
		expect(query.status).toBe(TextileProductStatus.PUBLISHED);
	});

	it('applyPublishedStatusFilter skips status when includeAllStatuses is true', () => {
		const query: Record<string, unknown> = {};
		applyPublishedStatusFilter(query, true, SuperfoodProductStatus.PUBLISHED);
		expect(query.status).toBeUndefined();
	});
});

describe('GetAllTextileProductsForManagementUseCase', () => {
	it('passes includeAllStatuses to repository', async () => {
		const getAllWithFilters = jest
			.fn()
			.mockResolvedValue({ products: [], total: 0 });
		const getFilterCounts = jest.fn().mockResolvedValue({});
		const textileProductRepository = {
			getAllWithFilters,
			getFilterCounts,
		};
		const mediaUrlResolver = { resolveUrls: jest.fn().mockResolvedValue(new Map()) };
		const sellerResourceAccess = {
			resolveManagementOwnerIds: jest.fn().mockResolvedValue(null),
		};
		const useCase = new GetAllTextileProductsForManagementUseCase(
			textileProductRepository as never,
			mediaUrlResolver as never,
			sellerResourceAccess as never,
		);

		await useCase.handle(1, 10, 'admin-id', [AccountRole.ADMIN]);

		expect(getAllWithFilters).toHaveBeenCalledWith(
			expect.objectContaining({ includeAllStatuses: true }),
		);
	});
});

describe('GetAllSuperfoodProductsForManagementUseCase', () => {
	it('passes includeAllStatuses to repository', async () => {
		const getAllWithFilters = jest
			.fn()
			.mockResolvedValue({ products: [], total: 0 });
		const superfoodProductRepository = { getAllWithFilters };
		const sellerResourceAccess = {
			resolveManagementOwnerIds: jest.fn().mockResolvedValue(null),
		};
		const useCase = new GetAllSuperfoodProductsForManagementUseCase(
			superfoodProductRepository as never,
			{ attachListMediaFromAggregate: jest.fn((p) => p) } as never,
			{ attachCatalogColorFromAggregate: jest.fn((p) => p) } as never,
			sellerResourceAccess as never,
		);

		await useCase.handle(1, 10, 'admin-id', [AccountRole.ADMIN]);

		expect(getAllWithFilters).toHaveBeenCalledWith(
			expect.objectContaining({ includeAllStatuses: true }),
		);
	});
});

describe('GetAllExperiencesForManagementUseCase', () => {
	it('delegates with includeAllStatuses true', async () => {
		const getAllExperiencesUseCase = {
			handle: jest.fn().mockResolvedValue({
				experiences: [],
				pagination: { total: 0, page: 1, per_page: 20 },
			}),
		};
		const useCase = new GetAllExperiencesForManagementUseCase(
			getAllExperiencesUseCase as never,
			{
				resolveManagementOwnerIds: jest.fn().mockResolvedValue(null),
			} as never,
		);

		await useCase.handle({ page: 2, perPage: 5 }, 'admin-id', [
			AccountRole.ADMIN,
		]);

		expect(getAllExperiencesUseCase.handle).toHaveBeenCalledWith({
			page: 2,
			perPage: 5,
			includeAllStatuses: true,
		});
	});
});

describe('GetByIdTextileProductDetailUseCase — public catalog', () => {
	const hiddenProduct = {
		id: 'hidden-id',
		status: TextileProductStatus.HIDDEN,
		baseInfo: { mediaIds: [] },
		priceInventary: { totalStock: 1, basePrice: 10 },
	} as unknown as TextileProduct;

	const makeUseCase = () =>
		new GetByIdTextileProductDetailUseCase(
			{
				getTextileProductById: jest.fn().mockResolvedValue(hiddenProduct),
			} as never,
			{} as never,
			{} as never,
			{} as never,
			{} as never,
			{} as never,
			{} as never,
			{} as never,
			{} as never,
			{} as never,
			{ buildForProduct: jest.fn() } as never,
			{ resolveUrls: jest.fn() } as never,
			{ resolveDetailed: jest.fn() } as never,
		);

	it('returns 404 for HIDDEN product', async () => {
		await expect(makeUseCase().handle('hidden-id')).rejects.toThrow(
			NotFoundException,
		);
	});
});

describe('GetBoxDetailUseCase — public catalog', () => {
	it('returns 404 for HIDDEN box', async () => {
		const hiddenBox = {
			id: 'box-1',
			status: AdminEntityStatus.HIDDEN,
			products: [],
			sealIds: [],
		} as unknown as Box;

		const useCase = new GetBoxDetailUseCase(
			{ getById: jest.fn().mockResolvedValue(hiddenBox) } as never,
			{ getByIds: jest.fn().mockResolvedValue([]) } as never,
			{ bulkFetchBoxDependencies: jest.fn() } as never,
			{ resolveDetailed: jest.fn() } as never,
			{ buildForProducts: jest.fn() } as never,
			{ getById: jest.fn() } as never,
			{ getByIds: jest.fn() } as never,
		);

		await expect(useCase.handle('box-1')).rejects.toThrow(NotFoundException);
	});
});
