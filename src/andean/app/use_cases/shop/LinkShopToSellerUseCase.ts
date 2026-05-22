import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { ShopRepository } from '../../datastore/shop/Shop.repo';
import { SellerProfileRepository } from '../../datastore/Seller.repo';
import { AccountRepository } from '../../datastore/Account.repo';
import { ShopStatus } from '../../../domain/enums/ShopStatus';
import { SellerStatus } from '../../../domain/enums/SellerStatus';
import { AccountRole } from '../../../domain/enums/AccountRole';
import { ShopSellerLinkValidator } from '../../services/ShopSellerLinkValidator';
import { SellerProfileMapper } from '../../../infra/services/SellerProfileMapper';
import { Shop } from '../../../domain/entities/shop/Shop';
import { SellerProfileResponse } from '../../models/users/SellerProfileResponse';
import { ShopResponse } from '../../models/shop/ShopResponse';

export type LinkShopToSellerResult = {
	shop: Shop;
	seller: SellerProfileResponse;
};

@Injectable()
export class LinkShopToSellerUseCase {
	constructor(
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
		@Inject(SellerProfileRepository)
		private readonly sellerRepository: SellerProfileRepository,
		@Inject(AccountRepository)
		private readonly accountRepository: AccountRepository,
		private readonly shopSellerLinkValidator: ShopSellerLinkValidator,
	) {}

	async handle(
		shopId: string,
		sellerId: string,
	): Promise<LinkShopToSellerResult> {
		if (!isValidObjectId(shopId)) {
			throw new BadRequestException('Invalid shop ID');
		}
		if (!isValidObjectId(sellerId)) {
			throw new BadRequestException('Invalid seller ID');
		}

		const shop = await this.shopRepository.getById(shopId);
		if (!shop) {
			throw new NotFoundException('Shop not found');
		}

		if (shop.sellerId === sellerId) {
			const seller = await this.sellerRepository.getSellerById(sellerId);
			if (!seller) {
				throw new NotFoundException('Seller not found');
			}
			return {
				shop,
				seller: SellerProfileMapper.toResponse(seller),
			};
		}

		const seller = await this.sellerRepository.getSellerById(sellerId);
		if (!seller) {
			throw new NotFoundException('Seller not found');
		}

		if (shop.sellerId) {
			await this.shopSellerLinkValidator.assertSellerHasNoShop(sellerId);
		} else {
			this.shopSellerLinkValidator.assertShopUnlinked(shop);
			await this.shopSellerLinkValidator.assertSellerHasNoShop(sellerId);
		}

		const updatedShop = await this.shopRepository.updateShop(shopId, {
			sellerId,
			status: ShopStatus.ACTIVE,
		});

		if (seller.status !== SellerStatus.APPROVED) {
			await this.sellerRepository.updateStatusByUserId(
				seller.userId,
				SellerStatus.APPROVED,
			);
		}

		const account = await this.accountRepository.getAccountById(seller.userId);
		if (account && !account.roles.includes(AccountRole.SELLER)) {
			await this.accountRepository.updateAccountRoles(seller.userId, [
				...account.roles,
				AccountRole.SELLER,
			]);
		}

		const updatedSeller =
			(await this.sellerRepository.getSellerById(sellerId)) ?? seller;

		return {
			shop: updatedShop,
			seller: SellerProfileMapper.toResponse(updatedSeller),
		};
	}

	static toShopResponse(shop: Shop): ShopResponse {
		return {
			id: shop.id,
			sellerId: shop.sellerId,
			name: shop.name,
			status: shop.status,
			categories: shop.categories,
			artisanPhotoMediaId: shop.artisanPhotoMediaId,
			seals: shop.seals,
		};
	}
}
