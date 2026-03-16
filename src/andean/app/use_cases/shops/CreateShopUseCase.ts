import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ShopRepository } from '../../datastore/Shop.repo';
import { CreateShopDto } from '../../../infra/controllers/dto/CreateShopDto';
import { Shop } from '../../../domain/entities/Shop';
import { SellerProfileRepository } from '../../datastore/Seller.repo';
import { ShopMapper } from '../../../infra/services/ShopMapper';

@Injectable()
export class CreateShopUseCase {
	constructor(
		@Inject(ShopRepository)
		private shopRepository: ShopRepository,
		@Inject(SellerProfileRepository)
		private sellerRepository: SellerProfileRepository,
	) {}

	async handle(shopDto: CreateShopDto): Promise<Shop> {
		const sellerFound = await this.sellerRepository.getSellerById(
			shopDto.sellerId,
		);
		if (!sellerFound) {
			throw new NotFoundException();
		}
		const shopToSave = ShopMapper.fromCreateDto(shopDto);
		return this.shopRepository.saveShop(shopToSave);
	}
}
