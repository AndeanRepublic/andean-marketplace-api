import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { ShopRepository } from '../../datastore/shop/Shop.repo';
import { Shop } from '../../../domain/entities/shop/Shop';

@Injectable()
export class UnlinkShopFromSellerUseCase {
	constructor(
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
	) {}

	async handle(shopId: string): Promise<Shop> {
		if (!isValidObjectId(shopId)) {
			throw new BadRequestException('Invalid shop ID');
		}

		const shop = await this.shopRepository.getById(shopId);
		if (!shop) {
			throw new NotFoundException('Shop not found');
		}

		if (!shop.sellerId) {
			return shop;
		}

		return this.shopRepository.clearShopSeller(shopId);
	}
}
