import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GetBoxForAdminEditUseCase } from './GetBoxForAdminEditUseCase';
import { BoxRepository } from '../../datastore/box/Box.repo';
import { VariantRepository } from '../../datastore/Variant.repo';
import { SuperfoodSizeOptionAlternativeRepository } from '../../datastore/superfoods/SuperfoodSizeOptionAlternative.repo';
import { SuperfoodCategoryRepository } from '../../datastore/superfoods/SuperfoodCategory.repo';
import { TextileCategoryRepository } from '../../datastore/textileProducts/TextileCategory.repo';
import { BoxProductResolutionService } from '../../../infra/services/box/BoxProductResolutionService';
import { TextileVariantPickerMediaService } from '../../../infra/services/box/TextileVariantPickerMediaService';
import { MediaUrlResolver } from '../../../infra/services/media/MediaUrlResolver';
import { Box, BoxProduct } from '../../../domain/entities/box/Box';
import { BoxProductType } from '../../../domain/enums/BoxProductType';
import { AdminEntityStatus } from '../../../domain/enums/AdminEntityStatus';
import { Variant } from '../../../domain/entities/Variant';
import { ProductType } from '../../../domain/enums/ProductType';
import { SuperfoodProduct } from '../../../domain/entities/superfoods/SuperfoodProduct';
import { SizeOptionAlternative } from '../../../domain/entities/superfoods/SizeOptionAlternative';
import { SuperfoodCategory } from '../../../domain/entities/superfoods/SuperfoodCategory';

const SIZE_ID = '6a7f3b37747108abdddbcd23';
const VARIANT_ID = 'variant-1';
const PRODUCT_ID = 'product-1';

function emptyBox(products: BoxProduct[] = []): Box {
	return new Box(
		'box-1',
		'Andean Box',
		'Slogan',
		'Narrative',
		'thumb-id',
		'main-id',
		products,
		AdminEntityStatus.HIDDEN,
		99,
		10,
		['seal-1'],
		new Date('2026-01-01'),
		new Date('2026-01-02'),
	);
}

describe('GetBoxForAdminEditUseCase', () => {
	let useCase: GetBoxForAdminEditUseCase;
	let boxRepository: { getById: jest.Mock };
	let boxResolutionService: { bulkFetchBoxDependencies: jest.Mock };
	let variantRepository: { getByProductId: jest.Mock };
	let sizeOptionRepository: { getByIds: jest.Mock };
	let superfoodCategoryRepository: { getCategoryById: jest.Mock };
	let textileCategoryRepository: { getCategoryById: jest.Mock };
	let textileVariantPickerMediaService: {
		resolveVariantMainMediaId: jest.Mock;
		buildVariantLabel: jest.Mock;
	};
	let mediaUrlResolver: { resolveUrls: jest.Mock };

	beforeEach(async () => {
		boxRepository = { getById: jest.fn() };
		boxResolutionService = { bulkFetchBoxDependencies: jest.fn() };
		variantRepository = { getByProductId: jest.fn() };
		sizeOptionRepository = { getByIds: jest.fn() };
		superfoodCategoryRepository = { getCategoryById: jest.fn() };
		textileCategoryRepository = { getCategoryById: jest.fn() };
		textileVariantPickerMediaService = {
			resolveVariantMainMediaId: jest.fn(),
			buildVariantLabel: jest.fn(),
		};
		mediaUrlResolver = { resolveUrls: jest.fn() };

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GetBoxForAdminEditUseCase,
				{ provide: BoxRepository, useValue: boxRepository },
				{
					provide: BoxProductResolutionService,
					useValue: boxResolutionService,
				},
				{ provide: VariantRepository, useValue: variantRepository },
				{
					provide: SuperfoodSizeOptionAlternativeRepository,
					useValue: sizeOptionRepository,
				},
				{
					provide: SuperfoodCategoryRepository,
					useValue: superfoodCategoryRepository,
				},
				{
					provide: TextileCategoryRepository,
					useValue: textileCategoryRepository,
				},
				{
					provide: TextileVariantPickerMediaService,
					useValue: textileVariantPickerMediaService,
				},
				{ provide: MediaUrlResolver, useValue: mediaUrlResolver },
			],
		}).compile();

		useCase = module.get(GetBoxForAdminEditUseCase);
	});

	it('throws when the box does not exist', async () => {
		boxRepository.getById.mockResolvedValue(null);
		await expect(useCase.handle('missing')).rejects.toThrow(NotFoundException);
	});

	it('returns three empty slots when the box has no products', async () => {
		const box = emptyBox();
		boxRepository.getById.mockResolvedValue(box);
		boxResolutionService.bulkFetchBoxDependencies.mockResolvedValue({
			superfoodMap: new Map(),
			textileMap: new Map(),
			variantMap: new Map(),
			mediaMap: new Map(),
		});
		mediaUrlResolver.resolveUrls.mockResolvedValue(new Map());

		const result = await useCase.handle(box.id);

		expect(result.slots).toHaveLength(3);
		expect(result.slots.every((slot) => slot.productId === null)).toBe(true);
		expect(result.name).toBe('Andean Box');
		expect(variantRepository.getByProductId).not.toHaveBeenCalled();
	});

	it('hydrates a superfood line with variants, size label and media', async () => {
		const line = new BoxProduct(
			BoxProductType.SUPERFOOD,
			VARIANT_ID,
			40,
			'nar-1',
		);
		const box = emptyBox([line]);
		const variant = new Variant(
			VARIANT_ID,
			PRODUCT_ID,
			ProductType.SUPERFOOD,
			{ SIZE: SIZE_ID },
			50,
			8,
			new Date(),
			new Date(),
		);
		const product = {
			id: PRODUCT_ID,
			categoryId: 'cat-1',
			baseInfo: {
				title: 'Sacha Inchi',
				productMedia: {
					mainImgId: 'main-img',
					otherImagesId: ['nar-1'],
				},
			},
		} as SuperfoodProduct;

		boxRepository.getById.mockResolvedValue(box);
		boxResolutionService.bulkFetchBoxDependencies.mockResolvedValue({
			superfoodMap: new Map([[PRODUCT_ID, product]]),
			textileMap: new Map(),
			variantMap: new Map([[VARIANT_ID, variant]]),
			mediaMap: new Map(),
		});
		variantRepository.getByProductId.mockResolvedValue([variant]);
		sizeOptionRepository.getByIds.mockResolvedValue([
			new SizeOptionAlternative(SIZE_ID, '250 g', 250, 'g', 10),
		]);
		superfoodCategoryRepository.getCategoryById.mockResolvedValue(
			new SuperfoodCategory('cat-1', 'Seeds', 'ENABLED'),
		);
		mediaUrlResolver.resolveUrls.mockResolvedValue(
			new Map([
				['main-img', 'https://cdn/main.png'],
				['nar-1', 'https://cdn/nar.png'],
			]),
		);

		const result = await useCase.handle(box.id);
		const slot = result.slots[0];

		expect(slot?.productType).toBe(BoxProductType.SUPERFOOD);
		expect(slot?.productId).toBe(PRODUCT_ID);
		expect(slot?.variantId).toBe(VARIANT_ID);
		expect(slot?.productTitle).toBe('Sacha Inchi');
		expect(slot?.categoryName).toBe('Seeds');
		expect(slot?.variantLabel).toBe('250 g');
		expect(slot?.catalogPrice).toBe(50);
		expect(slot?.stock).toBe(8);
		expect(slot?.imageUrl).toBe('https://cdn/main.png');
		expect(slot?.boxPrice).toBe(40);
		expect(slot?.narrativeImgId).toBe('nar-1');
		expect(slot?.variants).toHaveLength(1);
		expect(slot?.narrativeMedia).toEqual(
			expect.arrayContaining([
				{ id: 'main-img', url: 'https://cdn/main.png' },
				{ id: 'nar-1', url: 'https://cdn/nar.png' },
			]),
		);
		expect(result.slots[1]?.productId).toBeNull();
		expect(result.slots[2]?.productId).toBeNull();
	});
});
