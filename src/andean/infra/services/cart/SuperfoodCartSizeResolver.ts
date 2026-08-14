import { Inject, Injectable } from '@nestjs/common';
import { SuperfoodProductRepository } from '../../../app/datastore/superfoods/SuperfoodProduct.repo';
import { SuperfoodSizeOptionAlternativeRepository } from '../../../app/datastore/superfoods/SuperfoodSizeOptionAlternative.repo';
import { SuperfoodColorRepository } from '../../../app/datastore/superfoods/SuperfoodColor.repo';
import { SuperfoodProduct } from '../../../domain/entities/superfoods/SuperfoodProduct';
import { Variant } from '../../../domain/entities/Variant';
import { ProductType } from '../../../domain/enums/ProductType';
import { SuperfoodOptionName } from '../../../domain/enums/SuperfoodOptionName';

export type SuperfoodCartDisplay = {
	displayCombination: Record<string, string>;
	packageColorHex?: string;
};

/**
 * Enriquece items de superfood en el carrito: etiqueta SIZE humana y hex de fondo.
 */
@Injectable()
export class SuperfoodCartSizeResolver {
	constructor(
		@Inject(SuperfoodProductRepository)
		private readonly superfoodProductRepository: SuperfoodProductRepository,
		@Inject(SuperfoodSizeOptionAlternativeRepository)
		private readonly sizeOptionAlternativeRepository: SuperfoodSizeOptionAlternativeRepository,
		@Inject(SuperfoodColorRepository)
		private readonly superfoodColorRepository: SuperfoodColorRepository,
	) {}

	async enrich(variant: Variant | null): Promise<SuperfoodCartDisplay> {
		const combination = { ...(variant?.combination || {}) };
		if (!variant || variant.productType !== ProductType.SUPERFOOD) {
			return { displayCombination: combination };
		}

		const product =
			await this.superfoodProductRepository.getSuperfoodProductById(
				variant.productId,
			);

		const sizeId = combination.SIZE?.trim();
		let displayCombination = combination;
		if (sizeId) {
			const label = await this.resolveLabel(product, sizeId);
			if (label) {
				displayCombination = {
					...combination,
					SIZE: label,
					size: label,
				};
			}
		}

		const packageColorHex = await this.resolvePackageColorHex(product);
		return {
			displayCombination,
			...(packageColorHex ? { packageColorHex } : {}),
		};
	}

	async toDisplayCombination(
		variant: Variant | null,
	): Promise<Record<string, string>> {
		const { displayCombination } = await this.enrich(variant);
		return displayCombination;
	}

	private async resolveLabel(
		product: SuperfoodProduct | null,
		sizeId: string,
	): Promise<string | null> {
		const fromOptions = product?.options
			?.find((option) => option.name === SuperfoodOptionName.SIZE)
			?.values?.find((value) => value.idOptionAlternative?.trim() === sizeId)
			?.label?.trim();
		if (fromOptions) return fromOptions;

		const [alternative] =
			await this.sizeOptionAlternativeRepository.getByIds([sizeId]);
		return alternative?.nameLabel?.trim() || null;
	}

	private async resolvePackageColorHex(
		product: SuperfoodProduct | null,
	): Promise<string | undefined> {
		const colorId = product?.colorId?.trim();
		if (!colorId) return undefined;
		const color = await this.superfoodColorRepository.getById(colorId);
		const hex = color?.hexCodeColor?.trim();
		return hex || undefined;
	}
}
