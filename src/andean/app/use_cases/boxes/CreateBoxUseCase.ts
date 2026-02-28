import { Injectable, BadRequestException } from '@nestjs/common';
import { BoxRepository } from '../../datastore/box/Box.repo';
import { VariantRepository } from '../../datastore/Variant.repo';
import { SuperfoodProductRepository } from '../../datastore/superfoods/SuperfoodProduct.repo';
import { Box } from '../../../domain/entities/box/Box';
import { CreateBoxDto } from '../../../infra/controllers/dto/box/CreateBoxDto';
import { BoxMapper } from '../../../infra/services/box/BoxMapper';

@Injectable()
export class CreateBoxUseCase {
	constructor(
		private readonly boxRepository: BoxRepository,
		private readonly variantRepository: VariantRepository,
		private readonly superfoodProductRepository: SuperfoodProductRepository,
	) {}

	async handle(dto: CreateBoxDto): Promise<Box> {
		await this.validateStock(dto);
		const boxToSave = BoxMapper.fromCreateDto(dto);
		return this.boxRepository.create(boxToSave);
	}

	private async validateStock(dto: CreateBoxDto): Promise<void> {
		const variantIds = dto.products
			.filter((p) => p.variantId)
			.map((p) => p.variantId!);

		const productIds = dto.products
			.filter((p) => p.productId)
			.map((p) => p.productId!);

		const [variants, superfoodProducts] = await Promise.all([
			variantIds.length > 0
				? this.variantRepository.getByIds(variantIds)
				: Promise.resolve([]),
			productIds.length > 0
				? this.superfoodProductRepository.getByIds(productIds)
				: Promise.resolve([]),
		]);

		// Validar variantes (textiles)
		for (const variantId of variantIds) {
			const variant = variants.find((v) => v.id === variantId);
			if (!variant) {
				throw new BadRequestException({
					errorCode: 'VARIANT_NOT_FOUND',
					message: `La variante con id ${variantId} no existe`,
				});
			}
			if (variant.stock <= 0) {
				throw new BadRequestException({
					errorCode: 'VARIANT_OUT_OF_STOCK',
					message: `La variante con id ${variantId} no tiene stock disponible`,
				});
			}
		}

		// Validar productos superfood
		for (const productId of productIds) {
			const product = superfoodProducts.find((p) => p.id === productId);
			if (!product) {
				throw new BadRequestException({
					errorCode: 'PRODUCT_NOT_FOUND',
					message: `El producto superfood con id ${productId} no existe`,
				});
			}
			if (product.priceInventory.totalStock <= 0) {
				throw new BadRequestException({
					errorCode: 'PRODUCT_OUT_OF_STOCK',
					message: `El producto superfood con id ${productId} no tiene stock disponible`,
				});
			}
		}
	}
}
