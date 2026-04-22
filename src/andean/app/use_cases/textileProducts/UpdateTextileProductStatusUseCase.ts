import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileProductRepository } from '../../datastore/textileProducts/TextileProduct.repo';
import { TextileProductStatus } from '../../../domain/enums/TextileProductStatus';
import { AccountRole } from '../../../domain/enums/AccountRole';
import { SellerResourceAccessService } from 'src/andean/infra/services/seller/SellerResourceAccessService';

@Injectable()
export class UpdateTextileProductStatusUseCase {
	constructor(
		@Inject(TextileProductRepository)
		private readonly textileProductRepository: TextileProductRepository,
		private readonly sellerResourceAccess: SellerResourceAccessService,
	) {}

	async handle(
		id: string,
		status: TextileProductStatus,
		requestingUserId: string,
		roles: AccountRole[],
	) {
		const product = await this.textileProductRepository.getTextileProductById(id);
		if (!product) throw new NotFoundException('Textile product not found');
		await this.sellerResourceAccess.assertSellerCanManageOwner(
			requestingUserId,
			roles,
			product.baseInfo.ownerType,
			product.baseInfo.ownerId,
		);
		const updated = await this.textileProductRepository.updateStatus(id, status);
		if (!updated) throw new NotFoundException('Textile product not found');
		return updated;
	}
}
