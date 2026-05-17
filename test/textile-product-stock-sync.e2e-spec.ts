import { TextileProductStockFromVariantsSync } from '../src/andean/infra/services/textileProducts/TextileProductStockFromVariantsSync';
import { SyncVariantsUseCase } from '../src/andean/app/use_cases/variant/SyncVariantsUseCase';
import { ProductType } from '../src/andean/domain/enums/ProductType';

describe('TextileProductStockFromVariantsSync', () => {
	it('sets totalStock to the sum of variant stocks', async () => {
		const setTotalStock = jest.fn().mockResolvedValue(null);
		const sync = new TextileProductStockFromVariantsSync(
			{
				getByProductId: jest.fn().mockResolvedValue([
					{ stock: 20 },
					{ stock: 30 },
				]),
			} as never,
			{ setTotalStock } as never,
		);

		const total = await sync.apply('product-1');

		expect(total).toBe(50);
		expect(setTotalStock).toHaveBeenCalledWith('product-1', 50);
	});
});

describe('SyncVariantsUseCase — totalStock from variants', () => {
	it('recalculates product totalStock after sync instead of applying delta', async () => {
		const apply = jest.fn().mockResolvedValue(50);
		const update = jest.fn().mockResolvedValue({
			id: 'v1',
			stock: 25,
			combination: { color: 'Rojo', size: 'M' },
		});
		const useCase = new SyncVariantsUseCase(
			{
				getByProductId: jest.fn().mockResolvedValue([
					{
						id: 'v1',
						stock: 10,
						combination: { color: 'Rojo', size: 'M' },
					},
				]),
				update,
				createMany: jest.fn().mockResolvedValue([]),
				delete: jest.fn(),
			} as never,
			{ apply } as never,
		);

		await useCase.execute({
			productId: 'product-1',
			productType: ProductType.TEXTILE,
			variants: [
				{
					combination: { color: 'Rojo', size: 'M' },
					price: 100,
					stock: 25,
				},
			],
		});

		expect(apply).toHaveBeenCalledTimes(1);
		expect(apply).toHaveBeenCalledWith('product-1');
	});
});
