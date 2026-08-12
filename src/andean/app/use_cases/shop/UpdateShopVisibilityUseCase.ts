import {
	BadRequestException,
	ForbiddenException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { ShopRepository } from '../../datastore/shop/Shop.repo';
import { SellerProfileRepository } from '../../datastore/Seller.repo';
import { Shop } from '../../../domain/entities/shop/Shop';
import { ShopStatus } from '../../../domain/enums/ShopStatus';
import { SellerStatus } from '../../../domain/enums/SellerStatus';
import { AccountRole } from '../../../domain/enums/AccountRole';

const VISIBILITY_STATUSES: ShopStatus[] = [
	ShopStatus.ACTIVE,
	ShopStatus.DEACTIVATED,
];

@Injectable()
export class UpdateShopVisibilityUseCase {
	constructor(
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
		@Inject(SellerProfileRepository)
		private readonly sellerProfileRepository: SellerProfileRepository,
	) {}

	async handle(
		shopId: string,
		status: ShopStatus.ACTIVE | ShopStatus.DEACTIVATED,
		requestingUserId: string,
		roles: AccountRole[],
	): Promise<Shop> {
		if (!isValidObjectId(shopId)) {
			throw new BadRequestException('Invalid shop ID');
		}

		if (!VISIBILITY_STATUSES.includes(status)) {
			throw new BadRequestException(
				'Status must be ACTIVE or DEACTIVATED',
			);
		}

		const shop = await this.shopRepository.getById(shopId);
		if (!shop) {
			throw new NotFoundException('Shop not found');
		}

		if (!roles.includes(AccountRole.ADMIN)) {
			const sellerProfile =
				await this.sellerProfileRepository.getSellerByUserId(requestingUserId);
			if (!sellerProfile || sellerProfile.id !== shop.sellerId) {
				throw new ForbiddenException('You can only modify your own resource');
			}
			if (sellerProfile.status !== SellerStatus.APPROVED) {
				throw new ForbiddenException(
					'Seller profile must be approved before changing shop visibility',
				);
			}
		}

		if (
			shop.status !== ShopStatus.ACTIVE &&
			shop.status !== ShopStatus.DEACTIVATED
		) {
			throw new BadRequestException(
				'Shop visibility can only be changed when status is ACTIVE or DEACTIVATED',
			);
		}

		if (shop.status === status) {
			return shop;
		}

		return this.shopRepository.updateStatus(shopId, status);
	}
}
