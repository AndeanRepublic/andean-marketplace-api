import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { SuperfoodProductRepository } from '../../datastore/superfoods/SuperfoodProduct.repo';
import { UpdateSuperfoodDto } from '../../../infra/controllers/dto/superfoods/UpdateSuperfoodDto';
import { SuperfoodProduct } from '../../../domain/entities/superfoods/SuperfoodProduct';
import { SuperfoodBasicInfo } from '../../../domain/entities/superfoods/SuperfoodBasicInfo';
import { SuperfoodPriceInventory } from '../../../domain/entities/superfoods/SuperfoodPriceInventory';
import { SuperfoodDetailProduct } from '../../../domain/entities/superfoods/SuperfoodDetailProduct';
import { SuperfoodElaborationTime } from '../../../domain/entities/superfoods/SuperfoodElaborationTime';
import { SuperfoodNutritionalItem } from '../../../domain/entities/superfoods/SuperfoodNutritionalItem';
import { SuperfoodDetailTraceability } from '../../../domain/entities/superfoods/SuperfoodDetailTraceability';
import { SuperfoodOptions } from '../../../domain/entities/superfoods/SuperfoodOptions';
import { SuperfoodOptionsItem } from '../../../domain/entities/superfoods/SuperfoodOptionsItem';
import { SuperfoodVariant } from '../../../domain/entities/superfoods/SuperfoodVariant';

@Injectable()
export class UpdateSuperfoodProductUseCase {
	constructor(
		@Inject(SuperfoodProductRepository)
		private readonly superfoodProductRepository: SuperfoodProductRepository,
	) { }

	async handle(productId: string, dto: UpdateSuperfoodDto): Promise<SuperfoodProduct> {
		// 1. Validar que el producto existe
		const existingProduct = await this.superfoodProductRepository.getSuperfoodProductById(productId);
		if (!existingProduct) {
			throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
		}

		// 2. Validaciones de negocio si se actualizan precios/stock
		if (dto.priceInventory?.basePrice !== undefined && dto.priceInventory.basePrice <= 0) {
			throw new BadRequestException('El precio base debe ser mayor a 0');
		}

		if (dto.priceInventory?.totalStock !== undefined && dto.priceInventory.totalStock < 0) {
			throw new BadRequestException('El stock total no puede ser negativo');
		}

		// 3. Validar variantes duplicadas si se actualizan
		if (dto.variants && dto.variants.length > 0) {
			const combinations = dto.variants.map(v => JSON.stringify(v.combination));
			const uniqueCombinations = new Set(combinations);
			if (combinations.length !== uniqueCombinations.size) {
				throw new BadRequestException('Hay variantes con combinaciones duplicadas');
			}

			// Validar precios y stocks de variantes
			for (const variant of dto.variants) {
				if (variant.price < 0) {
					throw new BadRequestException('El precio de cada variante debe ser mayor o igual a 0');
				}
				if (variant.stock < 0) {
					throw new BadRequestException('El stock de cada variante debe ser mayor o igual a 0');
				}
			}
		}

		// 4. Crear entidad actualizada mezclando existente con nuevo
		const updatedBaseInfo = dto.baseInfo
			? new SuperfoodBasicInfo(
				dto.baseInfo.title ?? existingProduct.baseInfo.title,
				dto.baseInfo.mediaIds ?? existingProduct.baseInfo.mediaIds,
				dto.baseInfo.description ?? existingProduct.baseInfo.description,
				dto.baseInfo.general_features ?? existingProduct.baseInfo.general_features,
				dto.baseInfo.nutritional_features ?? existingProduct.baseInfo.nutritional_features,
				dto.baseInfo.benefits ?? existingProduct.baseInfo.benefits,
				dto.baseInfo.ownerType ?? existingProduct.baseInfo.ownerType,
				dto.baseInfo.ownerId ?? existingProduct.baseInfo.ownerId,
			)
			: existingProduct.baseInfo;

		const updatedPriceInventory = dto.priceInventory
			? new SuperfoodPriceInventory(
				dto.priceInventory.basePrice ?? existingProduct.priceInventory.basePrice,
				dto.priceInventory.totalStock ?? existingProduct.priceInventory.totalStock,
				dto.priceInventory.SKU ?? existingProduct.priceInventory.SKU,
			)
			: existingProduct.priceInventory;

		const updatedDetailProduct = dto.detailProduct
			? new SuperfoodDetailProduct(
				dto.detailProduct.type ?? existingProduct.detailProduct.type,
				dto.detailProduct.productPresentation ?? existingProduct.detailProduct.productPresentation,
				dto.detailProduct.consumptionWay ?? existingProduct.detailProduct.consumptionWay,
				dto.detailProduct.consumptionSuggestions ?? existingProduct.detailProduct.consumptionSuggestions,
				dto.detailProduct.salesUnitSize ?? existingProduct.detailProduct.salesUnitSize,
				dto.detailProduct.medicRecommendations ?? existingProduct.detailProduct.medicRecommendations,
				dto.detailProduct.healthWarnings ?? existingProduct.detailProduct.healthWarnings,
				dto.detailProduct.elaborationTime
					? new SuperfoodElaborationTime(
						dto.detailProduct.elaborationTime.days,
						dto.detailProduct.elaborationTime.hours,
					)
					: existingProduct.detailProduct.elaborationTime,
			)
			: existingProduct.detailProduct;

		const updatedNutritionalContent = dto.nutritionalContent
			? dto.nutritionalContent.map(
				(item) => new SuperfoodNutritionalItem(
					crypto.randomUUID(), // Nuevo ID ya que estamos reemplazando el array completo
					item.quantity,
					item.nutrient,
					item.strikingFeature,
					item.selected ?? false,
				)
			)
			: existingProduct.nutritionalContent;

		const updatedDetailTraceability = dto.detailProduct
			? new SuperfoodDetailTraceability(
				dto.detailProduct.handmade ?? existingProduct.detailTraceability.handmade,
				dto.detailProduct.secondaryMaterials ?? existingProduct.detailTraceability.secondaryMaterials,
				dto.detailProduct.originProductCommunityId ?? existingProduct.detailTraceability.originProductCommunityId,
				dto.detailProduct.productionMethod ?? existingProduct.detailTraceability.productionMethod,
				dto.detailProduct.preservationMethod ?? existingProduct.detailTraceability.preservationMethod,
				dto.detailProduct.isArtesanal ?? existingProduct.detailTraceability.isArtesanal,
				dto.detailProduct.isNatural ?? existingProduct.detailTraceability.isNatural,
				dto.detailProduct.isEatableWithoutPrep ?? existingProduct.detailTraceability.isEatableWithoutPrep,
				dto.detailProduct.canCauseAllergies ?? existingProduct.detailTraceability.canCauseAllergies,
				dto.detailProduct.certification ?? existingProduct.detailTraceability.certification,
			)
			: existingProduct.detailTraceability;

		const updatedOptions = dto.options
			? dto.options.map((opt) =>
				new SuperfoodOptions(
					crypto.randomUUID(), // Nuevo ID ya que estamos reemplazando el array completo
					opt.name,
					opt.values.map((val) => new SuperfoodOptionsItem(
						crypto.randomUUID(), // Nuevo ID para cada valor
						val.label,
						val.mediaIds || []
					))
				)
			)
			: existingProduct.options;
		const updatedVariants = dto.variants
			? dto.variants.map((variant) =>
				new SuperfoodVariant(
					crypto.randomUUID(), // Nuevo ID ya que estamos reemplazando el array completo
					variant.combination, variant.price,
					variant.stock
				)
			)
			: existingProduct.variants;

		const updatedProduct = new SuperfoodProduct(
			existingProduct.id,
			dto.categoryId ?? existingProduct.categoryId,
			dto.status ?? existingProduct.status,
			updatedBaseInfo,
			updatedPriceInventory,
			updatedDetailProduct,
			updatedNutritionalContent,
			updatedDetailTraceability,
			dto.productTraceability ?? existingProduct.productTraceability,
			updatedOptions,
			updatedVariants,
			existingProduct.createdAt,
			new Date(), // updatedAt
		);

		// 5. Guardar cambios
		return this.superfoodProductRepository.updateSuperfoodProduct(updatedProduct);
	}
}
