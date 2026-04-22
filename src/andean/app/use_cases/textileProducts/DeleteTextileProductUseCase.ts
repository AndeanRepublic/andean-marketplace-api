import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileProductRepository } from '../../datastore/textileProducts/TextileProduct.repo';
import { AccountRole } from 'src/andean/domain/enums/AccountRole';
import { SellerResourceAccessService } from 'src/andean/infra/services/seller/SellerResourceAccessService';

@Injectable()
export class DeleteTextileProductUseCase {
	constructor(
		@Inject(TextileProductRepository)
		private readonly textileProductRepository: TextileProductRepository,
		private readonly sellerResourceAccess: SellerResourceAccessService,
	) {}

	async handle(
		id: string,
		requestingUserId: string,
		roles: AccountRole[],
	): Promise<void> {
		const productFound =
			await this.textileProductRepository.getTextileProductById(id);
		if (!productFound) {
			throw new NotFoundException('Textile product not found');
		}

		await this.sellerResourceAccess.assertSellerCanManageOwner(
			requestingUserId,
			roles,
			productFound.baseInfo.ownerType,
			productFound.baseInfo.ownerId,
		);

		await this.textileProductRepository.deleteTextileProduct(id);
		return;
	}
}
