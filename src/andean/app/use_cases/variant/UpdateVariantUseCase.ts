import {
	Injectable,
	Inject,
	NotFoundException,
	ForbiddenException,
} from '@nestjs/common';
import { VariantRepository } from '../../datastore/Variant.repo';
import { TextileProductRepository } from '../../datastore/textileProducts/TextileProduct.repo';
import { ShopRepository } from '../../datastore/Shop.repo';
import { SellerProfileRepository } from '../../datastore/Seller.repo';
import { Variant } from '../../../domain/entities/Variant';
import { UpdateVariantDto } from '../../../infra/controllers/dto/variant/UpdateVariantDto';
import { VariantMapper } from '../../../infra/services/VariantMapper';
import { ProductType } from '../../../domain/enums/ProductType';
import { OwnerType } from 'src/andean/domain/enums/OwnerType';
import { AccountRole } from 'src/andean/domain/enums/AccountRole';

@Injectable()
export class UpdateVariantUseCase {
	constructor(
		@Inject(VariantRepository)
		private readonly variantRepository: VariantRepository,
		@Inject(TextileProductRepository)
		private readonly textileProductRepository: TextileProductRepository,
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
		@Inject(SellerProfileRepository)
		private readonly sellerProfileRepository: SellerProfileRepository,
	) {}

	async execute(
		id: string,
		dto: UpdateVariantDto,
		requestingUserId: string,
		roles: AccountRole[],
	): Promise<Variant> {
		// Verificar existencia
		const existing = await this.variantRepository.getById(id);
		if (!existing) {
			throw new NotFoundException(`Variant with id ${id} not found`);
		}

		// Pattern G ownership check
		const isAdmin = roles.includes(AccountRole.ADMIN);
		if (!isAdmin) {
			if (existing.productType !== ProductType.TEXTILE) {
				throw new ForbiddenException('You can only modify your own resource');
			}
			const product = await this.textileProductRepository.getTextileProductById(
				existing.productId,
			);
			if (!product) throw new NotFoundException('Textile product not found');
			if (product.baseInfo.ownerType === OwnerType.COMMUNITY) {
				throw new ForbiddenException('You can only modify your own resource');
			}
			const seller =
				await this.sellerProfileRepository.getSellerByUserId(requestingUserId);
			if (!seller)
				throw new ForbiddenException('You can only modify your own resource');
			const shops = await this.shopRepository.getAllBySellerId(seller.id);
			const shopIds = shops.map((s) => s.id);
			if (!shopIds.includes(product.baseInfo.ownerId)) {
				throw new ForbiddenException('You can only modify your own resource');
			}
		}

		// Construir objeto de actualización
		const updateData = VariantMapper.fromUpdateDto(id, dto);

		// Actualizar
		const updated = await this.variantRepository.update(id, updateData);

		if (!updated) {
			throw new NotFoundException(`Failed to update Variant`);
		}

		return updated;
	}
}
