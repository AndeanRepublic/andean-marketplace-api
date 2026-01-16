import {
	Injectable,
	Inject,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { SuperfoodProductRepository } from '../../datastore/superfoods/SuperfoodProduct.repo';
import { UpdateSuperfoodDto } from '../../../infra/controllers/dto/superfoods/UpdateSuperfoodDto';
import { SuperfoodProduct } from '../../../domain/entities/superfoods/SuperfoodProduct';
import { SuperfoodProductMapper } from '../../../infra/services/superfood/SuperfoodProductMapper';
import { SuperfoodCategoryRepository } from '../../datastore/superfoods/SuperfoodCategory.repo';
import { ShopRepository } from '../../datastore/Shop.repo';
import { SuperfoodOwnerType } from '../../../domain/enums/SuperfoodOwnerType';
import { instanceToPlain } from 'class-transformer';
import { CreateSuperfoodDto } from '../../../infra/controllers/dto/superfoods/CreateSuperfoodDto';

@Injectable()
export class UpdateSuperfoodProductUseCase {
	constructor(
		@Inject(SuperfoodProductRepository)
		private readonly superfoodProductRepository: SuperfoodProductRepository,
		@Inject(SuperfoodCategoryRepository)
		private readonly categoryRepository: SuperfoodCategoryRepository,
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
	) {}

	async handle(
		productId: string,
		dto: CreateSuperfoodDto,
	): Promise<SuperfoodProduct> {
		// 1. Validar que el producto existe
		const existingProduct =
			await this.superfoodProductRepository.getSuperfoodProductById(productId);
		if (!existingProduct) {
			throw new NotFoundException(`Product with id ${productId} not found`);
		}

		// 2. Validar categoryId solo si existe en el DTO
		if (dto.categoryId) {
			const categoryFound = await this.categoryRepository.getCategoryById(
				dto.categoryId,
			);
			if (!categoryFound) {
				throw new NotFoundException(
					`Category with id ${dto.categoryId} not found`,
				);
			}
		}

		// 3. Validar ownerId según ownerType solo si existe en el DTO
		if (dto.baseInfo?.ownerType === SuperfoodOwnerType.SHOP) {
			if (dto.baseInfo?.ownerId) {
				const shopFound = await this.shopRepository.getById(
					dto.baseInfo.ownerId,
				);
				if (!shopFound) {
					throw new NotFoundException(
						`Shop with id ${dto.baseInfo.ownerId} not found`,
					);
				}
			}
		}
		// TODO: Agregar validación para COMMUNITY cuando se implemente

		// 4. Validaciones de negocio si se actualizan precios/stock
		if (
			dto.priceInventory?.basePrice !== undefined &&
			dto.priceInventory.basePrice <= 0
		) {
			throw new BadRequestException('The base price must be greater than 0');
		}

		if (
			dto.priceInventory?.totalStock !== undefined &&
			dto.priceInventory.totalStock < 0
		) {
			throw new BadRequestException('The total stock cannot be negative');
		}

		// 5. Validar variantes duplicadas si se actualizan
		if (dto.variants && dto.variants.length > 0) {
			const combinations = dto.variants.map((v) =>
				JSON.stringify(v.combination),
			);
			const uniqueCombinations = new Set(combinations);
			if (combinations.length !== uniqueCombinations.size) {
				throw new BadRequestException(
					'Hay variantes con combinaciones duplicadas',
				);
			}

			// Validar precios y stocks de variantes
			for (const variant of dto.variants) {
				if (variant.price < 0) {
					throw new BadRequestException(
						'The price of each variant must be greater than or equal to 0',
					);
				}
				if (variant.stock < 0) {
					throw new BadRequestException(
						'The stock of each variant must be greater than or equal to 0',
					);
				}
			}
		}

		// 7. Usar el mapper para crear la entidad actualizada
		const toUpdate = SuperfoodProductMapper.fromUpdateDto(productId, dto);

		// 8. Guardar cambios
		return this.superfoodProductRepository.updateSuperfoodProduct(toUpdate);
	}
}
