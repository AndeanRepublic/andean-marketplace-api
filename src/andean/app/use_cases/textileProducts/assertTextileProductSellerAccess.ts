import { ForbiddenException } from '@nestjs/common';
import { TextileProduct } from 'src/andean/domain/entities/textileProducts/TextileProduct';
import { OwnerType } from 'src/andean/domain/enums/OwnerType';
import { AccountRole } from 'src/andean/domain/enums/AccountRole';
import { ShopRepository } from '../../datastore/Shop.repo';
import { SellerProfileRepository } from '../../datastore/Seller.repo';

/**
 * Misma regla que actualizar/eliminar: admin puede todo; vendedor solo productos de tienda propia.
 */
export async function assertTextileProductSellerAccess(
	product: TextileProduct,
	requestingUserId: string,
	roles: AccountRole[],
	shopRepository: ShopRepository,
	sellerProfileRepository: SellerProfileRepository,
): Promise<void> {
	const isAdmin = roles.includes(AccountRole.ADMIN);
	if (isAdmin) return;
	if (product.baseInfo.ownerType === OwnerType.COMMUNITY) {
		throw new ForbiddenException('You can only modify your own resource');
	}
	const seller =
		await sellerProfileRepository.getSellerByUserId(requestingUserId);
	if (!seller)
		throw new ForbiddenException('You can only modify your own resource');
	const shops = await shopRepository.getAllBySellerId(seller.id);
	const shopIds = shops.map((s) => s.id);
	if (!shopIds.includes(product.baseInfo.ownerId)) {
		throw new ForbiddenException('You can only modify your own resource');
	}
}
