import {
	Injectable,
	Inject,
	NotFoundException,
	ForbiddenException,
} from '@nestjs/common';
import { VariantRepository } from '../../datastore/Variant.repo';
import { TextileProductRepository } from '../../datastore/textileProducts/TextileProduct.repo';
import { ProductType } from '../../../domain/enums/ProductType';
import { AccountRole } from 'src/andean/domain/enums/AccountRole';
import { SellerResourceAccessService } from 'src/andean/infra/services/seller/SellerResourceAccessService';

@Injectable()
export class DeleteVariantUseCase {
	constructor(
		@Inject(VariantRepository)
		private readonly variantRepository: VariantRepository,
		@Inject(TextileProductRepository)
		private readonly textileProductRepository: TextileProductRepository,
		private readonly sellerResourceAccess: SellerResourceAccessService,
	) {}

	async execute(
		id: string,
		requestingUserId: string,
		roles: AccountRole[],
	): Promise<void> {
		const existing = await this.variantRepository.getById(id);

		if (!existing) {
			throw new NotFoundException(`Variant with id ${id} not found`);
		}

		const isAdmin = roles.includes(AccountRole.ADMIN);
		if (!isAdmin) {
			if (existing.productType !== ProductType.TEXTILE) {
				throw new ForbiddenException('You can only modify your own resource');
			}
			const product = await this.textileProductRepository.getTextileProductById(
				existing.productId,
			);
			if (!product) throw new NotFoundException('Textile product not found');
			await this.sellerResourceAccess.assertSellerCanManageOwner(
				requestingUserId,
				roles,
				product.baseInfo.ownerType,
				product.baseInfo.ownerId,
			);
		}

		const deleted = await this.variantRepository.delete(id);

		if (!deleted) {
			throw new NotFoundException('Failed to delete Variant');
		}
	}
}
