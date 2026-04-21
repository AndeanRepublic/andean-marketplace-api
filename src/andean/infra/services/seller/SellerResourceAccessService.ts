import {
	ForbiddenException,
	Inject,
	Injectable,
} from '@nestjs/common';
import { SellerProfileRepository } from '../../../app/datastore/Seller.repo';
import { ShopRepository } from '../../../app/datastore/Shop.repo';
import { CommunityRepository } from '../../../app/datastore/community/community.repo';
import { OwnerType } from '../../../domain/enums/OwnerType';
import { AccountRole } from '../../../domain/enums/AccountRole';

const FORBIDDEN = 'You can only modify your own resource';

/**
 * Autorización unificada: ADMIN puede todo; SELLER solo si es dueño del owner del recurso.
 * SHOP: alguna tienda del vendedor coincide con ownerId.
 * COMMUNITY: la comunidad comparte providerInfoId con alguna tienda del vendedor (misma organización).
 */
@Injectable()
export class SellerResourceAccessService {
	constructor(
		@Inject(SellerProfileRepository)
		private readonly sellerProfileRepository: SellerProfileRepository,
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
		@Inject(CommunityRepository)
		private readonly communityRepository: CommunityRepository,
	) {}

	async assertSellerCanManageOwner(
		requestingUserId: string,
		roles: AccountRole[],
		ownerType: OwnerType,
		ownerId: string,
	): Promise<void> {
		if (roles.includes(AccountRole.ADMIN)) {
			return;
		}

		const seller =
			await this.sellerProfileRepository.getSellerByUserId(requestingUserId);
		if (!seller) {
			throw new ForbiddenException(FORBIDDEN);
		}

		const shops = await this.shopRepository.getAllBySellerId(seller.id);

		if (ownerType === OwnerType.SHOP) {
			if (shops.some((s) => s.id === ownerId)) {
				return;
			}
			throw new ForbiddenException(FORBIDDEN);
		}

		if (ownerType === OwnerType.COMMUNITY) {
			const community = await this.communityRepository.getById(ownerId);
			if (!community?.providerInfoId) {
				throw new ForbiddenException(FORBIDDEN);
			}
			const providerIds = new Set(
				shops
					.map((s) => s.providerInfoId)
					.filter((id): id is string => Boolean(id)),
			);
			if (providerIds.has(community.providerInfoId)) {
				return;
			}
			throw new ForbiddenException(FORBIDDEN);
		}

		throw new ForbiddenException(FORBIDDEN);
	}
}
