import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileProductRepository } from '../../datastore/textileProducts/TextileProduct.repo';
import { TextileProduct } from 'src/andean/domain/entities/textileProducts/TextileProduct';
import { ShopRepository } from '../../datastore/Shop.repo';
import { SellerProfileRepository } from '../../datastore/Seller.repo';
import { AccountRole } from 'src/andean/domain/enums/AccountRole';
import { assertTextileProductSellerAccess } from './assertTextileProductSellerAccess';

@Injectable()
export class GetTextileProductForSellerUseCase {
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
		requestingUserId: string,
		roles: AccountRole[],
	): Promise<TextileProduct> {
		const productFound =
			await this.textileProductRepository.getTextileProductById(id);
		if (!productFound) {
			throw new NotFoundException('Textile product not found');
		}
		await assertTextileProductSellerAccess(
			productFound,
			requestingUserId,
			roles,
			this.shopRepository,
			this.sellerProfileRepository,
		);
		return productFound;
	}
}
