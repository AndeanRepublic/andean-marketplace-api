import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { SuperfoodProductRepository } from '../../datastore/superfoods/SuperfoodProduct.repo';
import { DeleteDetailSourceProductUseCase } from '../detailSourceProduct/DeleteDetailSourceProductUseCase';
import { AccountRole } from 'src/andean/domain/enums/AccountRole';
import { SellerResourceAccessService } from 'src/andean/infra/services/seller/SellerResourceAccessService';

@Injectable()
export class DeleteSuperfoodProductUseCase {
	constructor(
		@Inject(SuperfoodProductRepository)
		private readonly superfoodProductRepository: SuperfoodProductRepository,

		private readonly deleteDetailSourceProductUseCase: DeleteDetailSourceProductUseCase,
		private readonly sellerResourceAccess: SellerResourceAccessService,
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

		await this.sellerResourceAccess.assertSellerCanManageOwner(
			requestingUserId,
			roles,
			productFound.baseInfo.ownerType,
			productFound.baseInfo.ownerId,
		);

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
