import { SellerCatalog } from '../src/andean/domain/enums/SellerCatalog';
import { ShopCategory } from '../src/andean/domain/enums/ShopCategory';
import { deriveSellerCatalogs } from '../src/andean/infra/services/seller/deriveSellerCatalogs';

describe('deriveSellerCatalogs', () => {
	it('maps TEXTILES shop category to the textiles catalog', () => {
		expect(deriveSellerCatalogs([[ShopCategory.TEXTILES]], true)).toEqual([
			SellerCatalog.TEXTILES,
			SellerCatalog.EXPERIENCES,
		]);
	});

	it('maps FOOD_AND_BEVERAGES shop category to superfoods', () => {
		expect(
			deriveSellerCatalogs([[ShopCategory.FOOD_AND_BEVERAGES]], true),
		).toEqual([SellerCatalog.SUPERFOODS, SellerCatalog.EXPERIENCES]);
	});

	it('includes both catalogs when the seller has both shop categories', () => {
		expect(
			deriveSellerCatalogs(
				[[ShopCategory.TEXTILES, ShopCategory.FOOD_AND_BEVERAGES]],
				true,
			),
		).toEqual([
			SellerCatalog.SUPERFOODS,
			SellerCatalog.TEXTILES,
			SellerCatalog.EXPERIENCES,
		]);
	});

	it('returns no catalogs when the seller has no shop or community', () => {
		expect(deriveSellerCatalogs([], false)).toEqual([]);
	});
});
