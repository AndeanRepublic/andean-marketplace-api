import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ShopRepository } from '../../datastore/Shop.repo';
import { CreateShopDto } from '../../../infra/controllers/dto/CreateShopDto';
import { Shop } from '../../../domain/entities/Shop';
import { SellerProfileRepository } from '../../datastore/Seller.repo';
import { ShopMapper } from '../../../infra/services/ShopMapper';
import { CreateProviderInfoUseCase } from '../providerInfo/CreateProviderInfoUseCase';

@Injectable()
export class CreateShopUseCase {
	constructor(
		@Inject(ShopRepository)
		private shopRepository: ShopRepository,
		@Inject(SellerProfileRepository)
		private sellerRepository: SellerProfileRepository,
		private readonly createProviderInfoUseCase: CreateProviderInfoUseCase,
	) {}

	async handle(shopDto: CreateShopDto): Promise<Shop> {
		if (shopDto.sellerId) {
			const sellerFound = await this.sellerRepository.getSellerById(
				shopDto.sellerId,
			);
			if (!sellerFound) {
				throw new NotFoundException('Seller not found');
			}
		}

		// Crear ProviderInfo si viene embebido y asignar su id
		let providerInfoId = shopDto.providerInfoId;
		if (shopDto.providerInfo) {
			const created = await this.createProviderInfoUseCase.handle(
				shopDto.providerInfo,
			);
			providerInfoId = created.id;
		}

		const dtoForShop = { ...shopDto, providerInfoId };
		delete (dtoForShop as any).providerInfo;
		const shopToSave = ShopMapper.fromCreateDto(dtoForShop);
		return this.shopRepository.saveShop(shopToSave);
	}
}
