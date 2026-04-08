import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileProductRepository } from '../../datastore/textileProducts/TextileProduct.repo';
import { TextileProductStatus } from '../../../domain/enums/TextileProductStatus';
import { ShopRepository } from '../../datastore/Shop.repo';
import { SellerProfileRepository } from '../../datastore/Seller.repo';
import { AccountRole } from '../../../domain/enums/AccountRole';
import { assertTextileProductSellerAccess } from './assertTextileProductSellerAccess';

@Injectable()
export class UpdateTextileProductStatusUseCase {
	constructor(
		@Inject(TextileProductRepository)
		private readonly textileProductRepository: TextileProductRepository,
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
		@Inject(SellerProfileRepository)
		private readonly sellerProfileRepository: SellerProfileRepository,
	) {}

	async handle(
		id: string,
		status: TextileProductStatus,
		requestingUserId: string,
		roles: AccountRole[],
	) {
		const product = await this.textileProductRepository.getTextileProductById(id);
		if (!product) throw new NotFoundException('Textile product not found');
		await assertTextileProductSellerAccess(
			product,
			requestingUserId,
			roles,
			this.shopRepository,
			this.sellerProfileRepository,
		);
		const updated = await this.textileProductRepository.updateStatus(id, status);
		if (!updated) throw new NotFoundException('Textile product not found');
		return updated;
	}
}
