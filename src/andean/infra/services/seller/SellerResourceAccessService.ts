import {
	ForbiddenException,
	Inject,
	Injectable,
} from '@nestjs/common';
import { SellerProfileRepository } from '../../../app/datastore/Seller.repo';
import { ShopRepository } from '../../../app/datastore/shop/Shop.repo';
import { CommunityRepository } from '../../../app/datastore/community/community.repo';
import { OwnerType } from '../../../domain/enums/OwnerType';
import { AccountRole } from '../../../domain/enums/AccountRole';
import { ShopCategory } from '../../../domain/enums/ShopCategory';
import { SellerCatalog } from '../../../domain/enums/SellerCatalog';
import { deriveSellerCatalogs } from './deriveSellerCatalogs';

export type SellerWorkspace = {
	sellerId: string;
	shopIds: string[];
	communityIds: string[];
	ownerIds: string[];
	catalogs: SellerCatalog[];
	shops: { id: string; name: string; categories: ShopCategory[] }[];
};

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

	async resolveWorkspace(userId: string): Promise<SellerWorkspace> {
		const seller =
			await this.sellerProfileRepository.getSellerByUserId(userId);
		if (!seller) {
			throw new ForbiddenException(FORBIDDEN);
		}

		const shops = await this.shopRepository.getAllBySellerId(seller.id);
		const shopIds = shops.map((s) => s.id);
		const providerInfoIds = shops
			.map((s) => s.providerInfoId)
			.filter((id): id is string => Boolean(id));
		const communityIds =
			await this.communityRepository.findIdsByProviderInfoIdIn(
				providerInfoIds,
			);
		const ownerIds = [...new Set([...shopIds, ...communityIds])];

		return {
			sellerId: seller.id,
			shopIds,
			communityIds,
			ownerIds,
			catalogs: deriveSellerCatalogs(
				shops.map((s) => s.categories ?? []),
				shopIds.length > 0 || communityIds.length > 0,
			),
			shops: shops.map((s) => ({
				id: s.id,
				name: s.name,
				categories: s.categories ?? [],
			})),
		};
	}

	/**
	 * `null` = ADMIN (sin filtro). `string[]` = owners del vendedor.
	 */
	async resolveManagementOwnerIds(
		userId: string,
		roles: AccountRole[],
	): Promise<string[] | null> {
		if (roles.includes(AccountRole.ADMIN)) {
			return null;
		}
		const workspace = await this.resolveWorkspace(userId);
		return workspace.ownerIds;
	}
}
