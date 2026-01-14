import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { SuperfoodProductRepository } from '../../datastore/superfoods/SuperfoodProduct.repo';
import { ShopRepository } from '../../datastore/Shop.repo';
import { SuperfoodCategoryRepository } from '../../datastore/superfoods/SuperfoodCategory.repo';
import { CreateSuperfoodDto } from '../../../infra/controllers/dto/superfoods/CreateSuperfoodDto';
import { SuperfoodProduct } from '../../../domain/entities/superfoods/SuperfoodProduct';
import { SuperfoodProductMapper } from '../../../infra/services/superfood/SuperfoodProductMapper';
import { SuperfoodOwnerType } from '../../../domain/enums/SuperfoodOwnerType';

@Injectable()
export class CreateSuperfoodProductUseCase {
	constructor(
		@Inject(SuperfoodProductRepository)
		private readonly superfoodProductRepository: SuperfoodProductRepository,

		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,

		@Inject(SuperfoodCategoryRepository)
		private readonly categoryRepository: SuperfoodCategoryRepository,
	) { }

	async handle(dto: CreateSuperfoodDto): Promise<SuperfoodProduct> {
		// 1. Validar que la categoría existe
		const categoryFound = await this.categoryRepository.getCategoryById(dto.categoryId);
		if (!categoryFound) {
			throw new NotFoundException(`Categoría con ID ${dto.categoryId} no encontrada`);
		}

		// 2. Validar que el owner existe (shop o community)
		if (dto.baseInfo.ownerType === SuperfoodOwnerType.SHOP) {
			const shopFound = await this.shopRepository.getById(dto.baseInfo.ownerId);
			if (!shopFound) {
				throw new NotFoundException(`Shop con ID ${dto.baseInfo.ownerId} no encontrado`);
			}
		}
		// TODO: Agregar validación para COMMUNITY cuando se implemente

		// 3. Validaciones de negocio
		if (dto.priceInventory.basePrice <= 0) {
			throw new BadRequestException('El precio base debe ser mayor a 0');
		}

		if (dto.priceInventory.totalStock < 0) {
			throw new BadRequestException('El stock total no puede ser negativo');
		}

		// 4. Validar que no hay variantes duplicadas
		if (dto.variants && dto.variants.length > 0) {
			const combinations = dto.variants.map(v => JSON.stringify(v.combination));
			const uniqueCombinations = new Set(combinations);
			if (combinations.length !== uniqueCombinations.size) {
				throw new BadRequestException('Hay variantes con combinaciones duplicadas');
			}

			// 5. Validar que cada variante tenga precio >= 0 y stock >= 0
			for (const variant of dto.variants) {
				if (variant.price < 0) {
					throw new BadRequestException('El precio de cada variante debe ser mayor o igual a 0');
				}
				if (variant.stock < 0) {
					throw new BadRequestException('El stock de cada variante debe ser mayor o igual a 0');
				}
			}
		}

		// 6. Validar SKU único (opcional - si lo necesitas)
		// const existingSKU = await this.superfoodProductRepository.findBySKU(dto.priceInventory.SKU);
		// if (existingSKU) {
		//   throw new BadRequestException(`El SKU ${dto.priceInventory.SKU} ya existe`);
		// }

		// 7. Mapear DTO a entidad de dominio
		const productToSave = SuperfoodProductMapper.fromCreateDto(dto);

		// 8. Guardar en base de datos
		return this.superfoodProductRepository.saveSuperfoodProduct(productToSave);
	}
}
