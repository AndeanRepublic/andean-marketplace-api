import { Inject, Injectable } from '@nestjs/common';
import { SuperfoodProductRepository } from '../../../app/datastore/superfoods/SuperfoodProduct.repo';
import { SuperfoodSizeOptionAlternativeRepository } from '../../../app/datastore/superfoods/SuperfoodSizeOptionAlternative.repo';
import { Variant } from '../../../domain/entities/Variant';
import { ProductType } from '../../../domain/enums/ProductType';
import { SuperfoodOptionName } from '../../../domain/enums/SuperfoodOptionName';

/**
 * Reemplaza el ObjectId de combination.SIZE por la etiqueta humana
 * (p. ej. "250 g") para que el carrito no muestre IDs de Mongo.
 */
@Injectable()
export class SuperfoodCartSizeResolver {
	constructor(
		@Inject(SuperfoodProductRepository)
		private readonly superfoodProductRepository: SuperfoodProductRepository,
		@Inject(SuperfoodSizeOptionAlternativeRepository)
		private readonly sizeOptionAlternativeRepository: SuperfoodSizeOptionAlternativeRepository,
	) {}

	async toDisplayCombination(
		variant: Variant | null,
	): Promise<Record<string, string>> {
		const combination = { ...(variant?.combination || {}) };
		if (!variant || variant.productType !== ProductType.SUPERFOOD) {
			return combination;
		}

		const sizeId = combination.SIZE?.trim();
		if (!sizeId) return combination;

		const label = await this.resolveLabel(variant.productId, sizeId);
		if (!label) return combination;

		return {
			...combination,
			SIZE: label,
			size: label,
		};
	}

	private async resolveLabel(
		productId: string,
		sizeId: string,
	): Promise<string | null> {
		const product =
			await this.superfoodProductRepository.getSuperfoodProductById(productId);
		const fromOptions = product?.options
			?.find((option) => option.name === SuperfoodOptionName.SIZE)
			?.values?.find((value) => value.idOptionAlternative?.trim() === sizeId)
			?.label?.trim();
		if (fromOptions) return fromOptions;

		const [alternative] =
			await this.sizeOptionAlternativeRepository.getByIds([sizeId]);
		return alternative?.nameLabel?.trim() || null;
	}
}
