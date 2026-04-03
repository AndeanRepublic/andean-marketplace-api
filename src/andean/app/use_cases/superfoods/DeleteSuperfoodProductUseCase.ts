import {
	Injectable,
	Inject,
	NotFoundException,
	ForbiddenException,
} from '@nestjs/common';
import { SuperfoodProductRepository } from '../../datastore/superfoods/SuperfoodProduct.repo';
import { DeleteDetailSourceProductUseCase } from '../detailSourceProduct/DeleteDetailSourceProductUseCase';
import { ShopRepository } from '../../datastore/Shop.repo';
import { SellerProfileRepository } from '../../datastore/Seller.repo';
import { OwnerType } from '../../../domain/enums/OwnerType';
import { AccountRole } from 'src/andean/domain/enums/AccountRole';

@Injectable()
export class DeleteSuperfoodProductUseCase {
	constructor(
		@Inject(SuperfoodProductRepository)
		private readonly superfoodProductRepository: SuperfoodProductRepository,

		private readonly deleteDetailSourceProductUseCase: DeleteDetailSourceProductUseCase,
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
		@Inject(SellerProfileRepository)
		private readonly sellerProfileRepository: SellerProfileRepository,
	) {}

	async handle(
		productId: string,
		requestingUserId: string,
		roles: AccountRole[],
	): Promise<void> {
		// 1. Validar que el producto existe antes de eliminar
		const productFound =
			await this.superfoodProductRepository.getSuperfoodProductById(productId);
		if (!productFound) {
			throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
		}

		// Ownership check
		const isAdmin = roles.includes(AccountRole.ADMIN);
		if (!isAdmin) {
			if (productFound.baseInfo.ownerType === OwnerType.COMMUNITY) {
				throw new ForbiddenException('You can only modify your own resource');
			}
			const seller =
				await this.sellerProfileRepository.getSellerByUserId(requestingUserId);
			if (!seller)
				throw new ForbiddenException('You can only modify your own resource');
			const shops = await this.shopRepository.getAllBySellerId(seller.id);
			const shopIds = shops.map((s) => s.id);
			if (!shopIds.includes(productFound.baseInfo.ownerId)) {
				throw new ForbiddenException('You can only modify your own resource');
			}
		}

		// 2. Si tiene detailSourceProductId, eliminarlo también
		if (productFound.detailSourceProductId) {
			try {
				await this.deleteDetailSourceProductUseCase.handle(
					productFound.detailSourceProductId,
				);
			} catch (error) {
				// Si el DetailSourceProduct no existe, continuar con la eliminación del superfood
				console.warn(
					`DetailSourceProduct ${productFound.detailSourceProductId} not found, continuing with superfood deletion`,
				);
			}
		}

		// 3. Eliminar el superfood
		await this.superfoodProductRepository.deleteSuperfoodProduct(productId);
	}
}
