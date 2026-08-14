import { Test, TestingModule } from '@nestjs/testing';
import { SuperfoodCartSizeResolver } from './SuperfoodCartSizeResolver';
import { SuperfoodProductRepository } from '../../../app/datastore/superfoods/SuperfoodProduct.repo';
import { SuperfoodSizeOptionAlternativeRepository } from '../../../app/datastore/superfoods/SuperfoodSizeOptionAlternative.repo';
import { Variant } from '../../../domain/entities/Variant';
import { ProductType } from '../../../domain/enums/ProductType';
import { SuperfoodOptionName } from '../../../domain/enums/SuperfoodOptionName';
import { SuperfoodOptions } from '../../../domain/entities/superfoods/SuperfoodOptions';
import { SuperfoodOptionsItem } from '../../../domain/entities/superfoods/SuperfoodOptionsItem';
import { SuperfoodProduct } from '../../../domain/entities/superfoods/SuperfoodProduct';
import { SizeOptionAlternative } from '../../../domain/entities/superfoods/SizeOptionAlternative';

const SIZE_ID = '6a7f3b37747108abdddbcd23';

function superfoodVariant(
	combination: Record<string, string> = { SIZE: SIZE_ID },
): Variant {
	return new Variant(
		'variant-1',
		'product-1',
		ProductType.SUPERFOOD,
		combination,
		50,
		10,
		new Date(),
		new Date(),
	);
}

describe('SuperfoodCartSizeResolver', () => {
	let resolver: SuperfoodCartSizeResolver;
	let productRepository: jest.Mocked<
		Pick<SuperfoodProductRepository, 'getSuperfoodProductById'>
	>;
	let sizeOptionRepository: jest.Mocked<
		Pick<SuperfoodSizeOptionAlternativeRepository, 'getByIds'>
	>;

	beforeEach(async () => {
		productRepository = {
			getSuperfoodProductById: jest.fn(),
		};
		sizeOptionRepository = {
			getByIds: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SuperfoodCartSizeResolver,
				{
					provide: SuperfoodProductRepository,
					useValue: productRepository,
				},
				{
					provide: SuperfoodSizeOptionAlternativeRepository,
					useValue: sizeOptionRepository,
				},
			],
		}).compile();

		resolver = module.get(SuperfoodCartSizeResolver);
	});

	it('returns empty combination when variant is null', async () => {
		await expect(resolver.toDisplayCombination(null)).resolves.toEqual({});
	});

	it('leaves textile combinations unchanged', async () => {
		const variant = new Variant(
			'variant-1',
			'product-1',
			ProductType.TEXTILE,
			{ size: 'M', color: 'gray' },
			40,
			5,
			new Date(),
			new Date(),
		);

		await expect(resolver.toDisplayCombination(variant)).resolves.toEqual({
			size: 'M',
			color: 'gray',
		});
		expect(productRepository.getSuperfoodProductById).not.toHaveBeenCalled();
	});

	it('replaces SIZE id with the product option label', async () => {
		productRepository.getSuperfoodProductById.mockResolvedValue({
			options: [
				new SuperfoodOptions(SuperfoodOptionName.SIZE, [
					new SuperfoodOptionsItem('250 g', undefined, SIZE_ID),
				]),
			],
		} as SuperfoodProduct);

		await expect(
			resolver.toDisplayCombination(superfoodVariant()),
		).resolves.toEqual({
			SIZE: '250 g',
			size: '250 g',
		});
		expect(sizeOptionRepository.getByIds).not.toHaveBeenCalled();
	});

	it('falls back to the size alternative nameLabel', async () => {
		productRepository.getSuperfoodProductById.mockResolvedValue({
			options: [],
		} as SuperfoodProduct);
		sizeOptionRepository.getByIds.mockResolvedValue([
			new SizeOptionAlternative(SIZE_ID, '400 g', 400, 'g', 8),
		]);

		await expect(
			resolver.toDisplayCombination(superfoodVariant()),
		).resolves.toEqual({
			SIZE: '400 g',
			size: '400 g',
		});
	});

	it('keeps the SIZE id when no label can be resolved', async () => {
		productRepository.getSuperfoodProductById.mockResolvedValue(null);
		sizeOptionRepository.getByIds.mockResolvedValue([]);

		await expect(
			resolver.toDisplayCombination(superfoodVariant()),
		).resolves.toEqual({ SIZE: SIZE_ID });
	});
});
