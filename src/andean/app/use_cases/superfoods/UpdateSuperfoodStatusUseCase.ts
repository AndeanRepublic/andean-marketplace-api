import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodProductRepository } from '../../datastore/superfoods/SuperfoodProduct.repo';
import { AccountRole } from '../../../domain/enums/AccountRole';
import { OwnerType } from '../../../domain/enums/OwnerType';
import { ShopRepository } from '../../datastore/Shop.repo';
import { SellerProfileRepository } from '../../datastore/Seller.repo';
import { SuperfoodProductStatus } from '../../../domain/enums/SuperfoodProductStatus';

@Injectable()
export class UpdateSuperfoodStatusUseCase {
	constructor(
		@Inject(SuperfoodProductRepository)
		private readonly superfoodProductRepository: SuperfoodProductRepository,
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
		@Inject(SellerProfileRepository)
		private readonly sellerProfileRepository: SellerProfileRepository,
	) {}

	async handle(
		productId: string,
		status: SuperfoodProductStatus,
		requestingUserId: string,
		roles: AccountRole[],
	) {
		const product = await this.superfoodProductRepository.getSuperfoodProductById(productId);
		if (!product) throw new NotFoundException(`Product with id ${productId} not found`);

		const isAdmin = roles.includes(AccountRole.ADMIN);
		if (!isAdmin) {
			if (product.baseInfo.ownerType === OwnerType.COMMUNITY) {
				throw new ForbiddenException('You can only modify your own resource');
			}
			const seller = await this.sellerProfileRepository.getSellerByUserId(requestingUserId);
			if (!seller) throw new ForbiddenException('You can only modify your own resource');
			const shops = await this.shopRepository.getAllBySellerId(seller.id);
			if (!shops.map((s) => s.id).includes(product.baseInfo.ownerId)) {
				throw new ForbiddenException('You can only modify your own resource');
			}
		}

		const updated = await this.superfoodProductRepository.updateStatus(productId, status);
		if (!updated) throw new NotFoundException(`Product with id ${productId} not found`);
		return updated;
	}
}
