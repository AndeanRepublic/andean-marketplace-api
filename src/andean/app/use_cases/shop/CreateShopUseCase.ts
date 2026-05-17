import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ShopRepository } from '../../datastore/shop/Shop.repo';
import { CreateShopDto } from '../../../infra/controllers/dto/shop/CreateShopDto';
import { Shop } from '../../../domain/entities/shop/Shop';
import { SellerProfileRepository } from '../../datastore/Seller.repo';
import { ShopMapper } from '../../../infra/services/shop/ShopMapper';
import { CreateProviderInfoUseCase } from '../providerInfo/CreateProviderInfoUseCase';
import { SealRepository } from '../../datastore/community/Seal.repo';

@Injectable()
export class CreateShopUseCase {
	constructor(
		@Inject(ShopRepository)
		private shopRepository: ShopRepository,
		@Inject(SellerProfileRepository)
		private sellerRepository: SellerProfileRepository,
		@Inject(SealRepository)
		private readonly sealRepository: SealRepository,
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

		if (shopDto.seals && shopDto.seals.length > 0) {
			for (const sealId of shopDto.seals) {
				const sealFound = await this.sealRepository.getById(sealId);
				if (!sealFound) {
					throw new NotFoundException(`Seal with id ${sealId} not found`);
				}
			}
		}

		// Crear ProviderInfo si viene embebido y asignar su id
		let providerInfoId: string | undefined;
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
