import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodProductRepository } from '../../datastore/superfoods/SuperfoodProduct.repo';
import { AccountRole } from '../../../domain/enums/AccountRole';
import { SellerResourceAccessService } from 'src/andean/infra/services/seller/SellerResourceAccessService';
import { SuperfoodProductStatus } from '../../../domain/enums/SuperfoodProductStatus';

@Injectable()
export class UpdateSuperfoodStatusUseCase {
	constructor(
		@Inject(SuperfoodProductRepository)
		private readonly superfoodProductRepository: SuperfoodProductRepository,
		private readonly sellerResourceAccess: SellerResourceAccessService,
	) {}

	async handle(
		productId: string,
		status: SuperfoodProductStatus,
		requestingUserId: string,
		roles: AccountRole[],
	) {
		const product = await this.superfoodProductRepository.getSuperfoodProductById(productId);
		if (!product) throw new NotFoundException(`Product with id ${productId} not found`);

		await this.sellerResourceAccess.assertSellerCanManageOwner(
			requestingUserId,
			roles,
			product.baseInfo.ownerType,
			product.baseInfo.ownerId,
		);

		const updated = await this.superfoodProductRepository.updateStatus(productId, status);
		if (!updated) throw new NotFoundException(`Product with id ${productId} not found`);
		return updated;
	}
}
