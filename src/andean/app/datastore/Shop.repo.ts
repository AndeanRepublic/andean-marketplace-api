import { Shop } from '../../domain/entities/Shop';
import { ShopCategory } from '../../domain/enums/ShopCategory';

export abstract class ShopRepository {
	abstract getAllBySellerId(sellerId: string): Promise<Shop[]>;
	abstract getById(id: string): Promise<Shop | null>;
	abstract saveShop(shop: Shop): Promise<Shop>;
	abstract deleteShop(id: string): Promise<void>;
	abstract getAllByCategory(category: ShopCategory): Promise<Shop[]>;
	abstract updateShop(id: string, data: Partial<Shop>): Promise<Shop>;
}
