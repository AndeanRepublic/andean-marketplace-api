import {
	ForbiddenException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { ShopRepository } from '../../datastore/Shop.repo';
import { SellerProfileRepository } from '../../datastore/Seller.repo';
import { AccountRole } from '../../../domain/enums/AccountRole';

@Injectable()
export class DeleteShopUseCase {
	constructor(
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
		@Inject(SellerProfileRepository)
		private readonly sellerProfileRepository: SellerProfileRepository,
	) {}

	async handle(
		shopId: string,
		requestingUserId: string,
		roles: AccountRole[],
	): Promise<void> {
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
		}

		await this.shopRepository.deleteShop(shopId);
	}
}
