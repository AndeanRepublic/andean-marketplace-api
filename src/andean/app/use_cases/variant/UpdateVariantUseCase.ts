import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { VariantRepository } from '../../datastore/Variant.repo';
import { TextileProductRepository } from '../../datastore/textileProducts/TextileProduct.repo';
import { Variant } from '../../../domain/entities/Variant';
import { UpdateVariantDto } from '../../../infra/controllers/dto/variant/UpdateVariantDto';
import { VariantMapper } from '../../../infra/services/VariantMapper';
import { ProductType } from '../../../domain/enums/ProductType';
import { AccountRole } from 'src/andean/domain/enums/AccountRole';
import { SellerResourceAccessService } from 'src/andean/infra/services/seller/SellerResourceAccessService';
import { TextileProductStockFromVariantsSync } from '../../../infra/services/textileProducts/TextileProductStockFromVariantsSync';

@Injectable()
export class UpdateVariantUseCase {
	constructor(
		@Inject(VariantRepository)
		private readonly variantRepository: VariantRepository,
		@Inject(TextileProductRepository)
		private readonly textileProductRepository: TextileProductRepository,
		private readonly sellerResourceAccess: SellerResourceAccessService,
		private readonly textileProductStockFromVariantsSync: TextileProductStockFromVariantsSync,
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

		// Construir objeto de actualización
		const updateData = VariantMapper.fromUpdateDto(id, dto);

		// Actualizar la variante
		const updated = await this.variantRepository.update(id, updateData);

		if (!updated) {
			throw new NotFoundException(`Failed to update Variant`);
		}

		if (
			existing.productType === ProductType.TEXTILE &&
			dto.stock !== undefined &&
			dto.stock !== existing.stock
		) {
			await this.textileProductStockFromVariantsSync.apply(existing.productId);
		}

		return updated;
	}
}
