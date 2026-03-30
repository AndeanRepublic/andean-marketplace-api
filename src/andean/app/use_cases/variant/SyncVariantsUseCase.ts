import { Injectable, Inject } from '@nestjs/common';
import { VariantRepository } from '../../datastore/Variant.repo';
import { TextileProductRepository } from '../../datastore/textileProducts/TextileProduct.repo';
import { Variant } from '../../../domain/entities/Variant';
import { SyncVariantsDto } from '../../../infra/controllers/dto/variant/SyncVariantsDto';
import { SyncVariantItemDto } from '../../../infra/controllers/dto/variant/SyncVariantItemDto';
import { VariantMapper } from '../../../infra/services/VariantMapper';
import { ProductType } from '../../../domain/enums/ProductType';

/**
 * Use case para sincronizar las variantes de un producto.
 *
 * Lógica:
 * 1. Recupera las variantes existentes del producto desde la BD
 * 2. Compara cada variante por el atributo `combination`
 * 3. Si combination coincide: actualiza los valores (price, stock) manteniendo el id
 * 4. Si la variante del usuario no tiene par en BD: crea nueva variante
 * 5. Si la variante de BD no tiene par en la lista del usuario: elimina la variante
 */
@Injectable()
export class SyncVariantsUseCase {
	constructor(
		@Inject(VariantRepository)
		private readonly variantRepository: VariantRepository,
		@Inject(TextileProductRepository)
		private readonly textileProductRepository: TextileProductRepository,
	) {}

	async execute(dto: SyncVariantsDto): Promise<Variant[]> {
		const { productId, productType, variants: userVariants } = dto;

		// 1. Recuperar variantes existentes del producto
		const existingVariants =
			await this.variantRepository.getByProductId(productId);

		// Crear un mapa de variantes existentes por combination (serializado como key)
		const existingMap = new Map<string, Variant>();
		for (const variant of existingVariants) {
			const key = this.serializeCombination(variant.combination);
			existingMap.set(key, variant);
		}

		// Crear un set de combinations del usuario para detectar las que se deben eliminar
		const userCombinationKeys = new Set<string>();
		for (const userVariant of userVariants) {
			const key = this.serializeCombination(userVariant.combination);
			userCombinationKeys.add(key);
		}

		const updatedVariants: Variant[] = [];
		const newVariants: Variant[] = [];
		const variantsToDelete: string[] = [];

		let totalStockDelta = 0;

		// 2. Procesar variantes del usuario
		for (const userVariant of userVariants) {
			const key = this.serializeCombination(userVariant.combination);
			const existingVariant = existingMap.get(key);

			if (existingVariant) {
				// 3. Combination coincide: actualizar valores manteniendo el id
				const updated = await this.variantRepository.update(
					existingVariant.id,
					{
						price: userVariant.price,
						stock: userVariant.stock,
						...(userVariant.sku !== undefined && { sku: userVariant.sku }),
						updatedAt: new Date(),
					},
				);
				if (updated) {
					updatedVariants.push(updated);
					totalStockDelta += userVariant.stock - existingVariant.stock;
				}
			} else {
				// 4. No existe en BD: crear nueva variante
				const newVariant = VariantMapper.fromCreateDto({
					productId,
					productType,
					combination: userVariant.combination,
					price: userVariant.price,
					stock: userVariant.stock,
					...(userVariant.sku && { sku: userVariant.sku }),
				});
				newVariants.push(newVariant);
				totalStockDelta += userVariant.stock;
			}
		}

		// 5. Detectar variantes de BD que no están en la lista del usuario (eliminar)
		for (const [key, existingVariant] of existingMap) {
			if (!userCombinationKeys.has(key)) {
				variantsToDelete.push(existingVariant.id);
				totalStockDelta -= existingVariant.stock;
			}
		}

		// Ejecutar creaciones y eliminaciones
		let createdVariants: Variant[] = [];
		if (newVariants.length > 0) {
			createdVariants = await this.variantRepository.createMany(newVariants);
		}

		for (const id of variantsToDelete) {
			await this.variantRepository.delete(id);
		}

		// Actualizar stock general si corresponde
		if (productType === ProductType.TEXTILE && totalStockDelta !== 0) {
			await this.textileProductRepository.adjustTotalStock(
				productId,
				totalStockDelta,
			);
		}

		// Retornar todas las variantes actuales del producto
		return [...updatedVariants, ...createdVariants];
	}

	/**
	 * Serializa el objeto combination a un string para usarlo como clave de comparación.
	 * Ordena las keys alfabéticamente para asegurar consistencia.
	 */
	private serializeCombination(combination: Record<string, string>): string {
		const sortedKeys = Object.keys(combination).sort();
		const normalized: Record<string, string> = {};
		for (const key of sortedKeys) {
			normalized[key] = combination[key];
		}
		return JSON.stringify(normalized);
	}
}
