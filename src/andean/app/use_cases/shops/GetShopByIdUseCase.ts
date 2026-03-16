import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ShopRepository } from '../../datastore/Shop.repo';
import { ProviderInfoRepository } from '../../datastore/ProviderInfo.repo';
import { Shop } from '../../../domain/entities/Shop';
import { ProviderInfo } from '../../../domain/entities/ProviderInfo';

export type ShopWithProviderInfo = Shop & { providerInfo?: ProviderInfo };

@Injectable()
export class GetShopByIdUseCase {
	constructor(
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
		@Inject(ProviderInfoRepository)
		private readonly providerInfoRepository: ProviderInfoRepository,
	) {}

	async handle(shopId: string): Promise<ShopWithProviderInfo> {
		const shopFound = await this.shopRepository.getById(shopId);
		if (!shopFound) {
			throw new NotFoundException('Shop not found');
		}

		let providerInfo: ProviderInfo | undefined;
		if (shopFound.providerInfoId) {
			const found = await this.providerInfoRepository.getById(shopFound.providerInfoId);
			providerInfo = found ?? undefined;
		}

		return { ...shopFound, providerInfo };
	}
}
