import { ShopPageInfo } from '../../../domain/entities/shop/ShopPageInfo';

export abstract class ShopPageInfoRepository {
	abstract create(data: ShopPageInfo): Promise<ShopPageInfo>;
	abstract update(id: string, data: Partial<ShopPageInfo>): Promise<ShopPageInfo>;
	abstract getById(id: string): Promise<ShopPageInfo | null>;
}
