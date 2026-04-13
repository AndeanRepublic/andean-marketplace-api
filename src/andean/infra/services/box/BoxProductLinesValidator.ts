import { BadRequestException, Injectable } from '@nestjs/common';
import { VariantRepository } from '../../../app/datastore/Variant.repo';
import {
	CreateBoxDto,
	BoxProductDto,
} from '../../controllers/dto/box/CreateBoxDto';
import { BoxProductType } from '../../../domain/enums/BoxProductType';
import { ProductType } from '../../../domain/enums/ProductType';
import { Variant } from '../../../domain/entities/Variant';

/**
 * Valida líneas de producto de un CreateBoxDto: variantId, existencia de variante y coherencia TEXTILE/SUPERFOOD.
 */
@Injectable()
export class BoxProductLinesValidator {
	private static readonly VARIANT_TYPE_RULES: Partial<
		Record<BoxProductType, { expected: ProductType; mismatchLabel: string }>
	> = {
		[BoxProductType.TEXTILE]: {
			expected: ProductType.TEXTILE,
			mismatchLabel: 'un producto textil',
		},
		[BoxProductType.SUPERFOOD]: {
			expected: ProductType.SUPERFOOD,
			mismatchLabel: 'un superfood',
		},
	};

	constructor(private readonly variantRepository: VariantRepository) {}

	async validate(dto: CreateBoxDto): Promise<void> {
		const variantById = await this.fetchVariantMapForDto(dto);
		for (const [index, line] of dto.products.entries()) {
			this.assertLineHasVariantId(line, index);
			const variant = this.requireVariantFromMap(
				variantById,
				line.variantId,
			);
			this.assertVariantMatchesBoxLineType(line, variant);
		}
	}

	private async fetchVariantMapForDto(
		dto: CreateBoxDto,
	): Promise<Map<string, Variant>> {
		const variantIds = dto.products.flatMap((p) =>
			p.variantId ? [p.variantId] : [],
		);
		const variants =
			variantIds.length > 0
				? await this.variantRepository.getByIds(variantIds)
				: [];
		return new Map(variants.map((v) => [v.id, v]));
	}

	private assertLineHasVariantId(
		line: BoxProductDto,
		lineIndex: number,
	): void {
		if (!line.variantId?.trim()) {
			throw new BadRequestException({
				errorCode: 'BOX_PRODUCT_REFERENCE_REQUIRED',
				message: `La línea ${lineIndex + 1} requiere variantId`,
			});
		}
	}

	private requireVariantFromMap(
		variantById: Map<string, Variant>,
		variantId: string,
	): Variant {
		const variant = variantById.get(variantId);
		if (!variant) {
			throw new BadRequestException({
				errorCode: 'VARIANT_NOT_FOUND',
				message: `La variante con id ${variantId} no existe`,
			});
		}
		return variant;
	}

	private assertVariantMatchesBoxLineType(
		line: BoxProductDto,
		variant: Variant,
	): void {
		const rule = BoxProductLinesValidator.VARIANT_TYPE_RULES[line.productType];
		if (!rule || variant.productType === rule.expected) return;

		throw new BadRequestException({
			errorCode: 'BOX_VARIANT_TYPE_MISMATCH',
			message: `La variante con id ${line.variantId} no corresponde a ${rule.mismatchLabel}`,
		});
	}
}
