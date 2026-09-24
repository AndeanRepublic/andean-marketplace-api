import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ShopRepository } from '../../datastore/shop/Shop.repo';
import { ProviderInfoRepository } from '../../datastore/ProviderInfo.repo';
import { ShopPageInfoRepository } from '../../datastore/shop/ShopPageInfo.repo';
import { FounderInfoRepository } from '../../datastore/shop/FounderInfo.repo';
import { Shop } from '../../../domain/entities/shop/Shop';
import { ProviderInfo } from '../../../domain/entities/ProviderInfo';
import { ShopPageInfo } from '../../../domain/entities/shop/ShopPageInfo';
import { FounderInfo } from '../../../domain/entities/shop/FounderInfo';

export type ShopWithRelations = Shop & {
	providerInfo?: ProviderInfo;
	pageInfo?: ShopPageInfo;
	founderInfo?: FounderInfo;
};

@Injectable()
export class GetShopByIdUseCase {
	constructor(
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
		@Inject(ProviderInfoRepository)
		private readonly providerInfoRepository: ProviderInfoRepository,
		@Inject(ShopPageInfoRepository)
		private readonly shopPageInfoRepository: ShopPageInfoRepository,
		@Inject(FounderInfoRepository)
		private readonly founderInfoRepository: FounderInfoRepository,
	) {}

	async handle(shopId: string): Promise<ShopWithRelations> {
		const shopFound = await this.shopRepository.getById(shopId);
		if (!shopFound) {
			throw new NotFoundException('Shop not found');
		}

		let providerInfo: ProviderInfo | undefined;
		if (shopFound.providerInfoId) {
			const found = await this.providerInfoRepository.getById(shopFound.providerInfoId);
			providerInfo = found ?? undefined;
		}

		let pageInfo: ShopPageInfo | undefined;
		if (shopFound.pageInfoId) {
			const found = await this.shopPageInfoRepository.getById(shopFound.pageInfoId);
			pageInfo = found ?? undefined;
		}

		let founderInfo: FounderInfo | undefined;
		if (shopFound.founderInfoId) {
			const found = await this.founderInfoRepository.getById(shopFound.founderInfoId);
			founderInfo = found ?? undefined;
		}

		return { ...shopFound, providerInfo, pageInfo, founderInfo };
	}
}
