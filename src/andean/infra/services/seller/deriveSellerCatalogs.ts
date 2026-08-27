import { SellerCatalog } from '../../../domain/enums/SellerCatalog';
import { ShopCategory } from '../../../domain/enums/ShopCategory';

export function deriveSellerCatalogs(
	shopCategories: ShopCategory[][],
	hasShopOrCommunity: boolean,
): SellerCatalog[] {
	const catalogs: SellerCatalog[] = [];
	const categories = new Set(shopCategories.flat());
	if (categories.has(ShopCategory.FOOD_AND_BEVERAGES)) {
		catalogs.push(SellerCatalog.SUPERFOODS);
	}
	if (categories.has(ShopCategory.TEXTILES)) {
		catalogs.push(SellerCatalog.TEXTILES);
	}
	if (hasShopOrCommunity) {
		catalogs.push(SellerCatalog.EXPERIENCES);
	}
	return catalogs;
}
