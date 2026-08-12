import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { ShopRepository } from '../../datastore/shop/Shop.repo';
import { Shop } from '../../../domain/entities/shop/Shop';
import { ShopStatus } from '../../../domain/enums/ShopStatus';

@Injectable()
export class UpdateShopStatusUseCase {
	constructor(
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
	) {}

	async handle(id: string, status: ShopStatus): Promise<Shop> {
		if (!isValidObjectId(id)) {
			throw new BadRequestException('Invalid shop ID');
		}

		const shop = await this.shopRepository.getById(id);
		if (!shop) {
			throw new NotFoundException('Shop not found');
		}

		if (shop.status === status) {
			return shop;
		}

		return this.shopRepository.updateStatus(id, status);
	}
}
