import { Inject, Injectable } from '@nestjs/common';
import { Variant } from 'src/andean/domain/entities/Variant';
import { TextileProduct } from 'src/andean/domain/entities/textileProducts/TextileProduct';
import { ProductType } from 'src/andean/domain/enums/ProductType';
import { TextileOptions } from 'src/andean/domain/entities/textileProducts/TextileOptions';
import { TextileOptionName } from 'src/andean/domain/enums/TextileOptionName';
import { ColorOptionAlternativeRepository } from '../../../app/datastore/textileProducts/ColorOptionAlternative.repo';
import { SizeOptionAlternativeRepository } from '../../../app/datastore/textileProducts/SizeOptionAlternative.repo';
import { MediaUrlResolver } from './MediaUrlResolver';

export interface TextileAvailableColor {
	color: string;
	hexCode: string;
	imgUrl: string;
}

export interface TextileVariantInfo {
	variantId: string;
	size: string;
	color: TextileAvailableColor;
	material: string;
	price: number;
	stock: number;
}

export interface TextileProductAttributes {
	variantInfo: TextileVariantInfo[];
}

@Injectable()
export class TextileProductAttributesAssembler {
	constructor(
		@Inject(ColorOptionAlternativeRepository)
		private readonly colorOptionAlternativeRepository: ColorOptionAlternativeRepository,
		@Inject(SizeOptionAlternativeRepository)
		private readonly sizeOptionAlternativeRepository: SizeOptionAlternativeRepository,
		private readonly mediaUrlResolver: MediaUrlResolver,
	) {}

	/**
	 * Resuelve etiqueta + hex del catálogo para un ítem de carrito textil.
	 * El producto debe cargarse fuera (evita ciclo Assembler → Repository → Assembler).
	 */
	async resolveColorOptionForProductAndVariant(
		product: Pick<TextileProduct, 'id' | 'options'>,
		variant: Variant,
	): Promise<{ label: string; hexCode: string } | null> {
		if (variant.productType !== ProductType.TEXTILE) {
			return null;
		}
		const attrs = await this.buildForProduct(product, [variant]);
		const info = attrs.variantInfo.find((v) => v.variantId === variant.id);
		if (!info) {
			return null;
		}
		return {
			label: info.color.color,
			hexCode: info.color.hexCode,
		};
	}

	async buildForProduct(
		product: Pick<TextileProduct, 'id' | 'options'>,
		variants: Variant[],
	): Promise<TextileProductAttributes> {
		const map = await this.buildForProducts([product], variants);
		return map.get(product.id) || { variantInfo: [] };
	}

	async buildForProducts(
		products: Array<Pick<TextileProduct, 'id' | 'options'>>,
		variants: Variant[],
	): Promise<Map<string, TextileProductAttributes>> {
		const colorAlts = await this.colorOptionAlternativeRepository.getAll();
		const sizeAlts = await this.sizeOptionAlternativeRepository.getAll();
		const colorAltById = new Map(colorAlts.map((item) => [item.id, item]));
		const sizeAltById = new Map(sizeAlts.map((item) => [item.id, item]));

		const mediaIds = this.collectColorMediaIds(products);
		const mediaUrlById =
			mediaIds.length > 0
				? await this.mediaUrlResolver.resolveUrls(mediaIds)
				: new Map<string, string>();

		const variantsByProductId = new Map<string, Variant[]>();
		for (const variant of variants) {
			const current = variantsByProductId.get(variant.productId) || [];
			current.push(variant);
			variantsByProductId.set(variant.productId, current);
		}

		const result = new Map<string, TextileProductAttributes>();
		for (const product of products) {
			const options = product.options || [];
			const sizeOption = this.getOption(options, TextileOptionName.SIZE);
			const colorOption = this.getOption(options, TextileOptionName.COLOR);
			const materialOption = this.getOption(
				options,
				TextileOptionName.MATERIAL,
			);
			const productVariants = variantsByProductId.get(product.id) || [];

			result.set(product.id, {
				variantInfo: this.buildVariantInfo(
					productVariants,
					sizeOption,
					colorOption,
					materialOption,
					sizeAltById,
					colorAltById,
					mediaUrlById,
				),
			});
		}

		return result;
	}

	private getOption(
		options: TextileOptions[],
		name: TextileOptionName,
	): TextileOptions | undefined {
		return options.find((opt) => opt.name === name);
	}

	private collectColorMediaIds(
		products: Array<Pick<TextileProduct, 'id' | 'options'>>,
	): string[] {
		const ids = new Set<string>();
		for (const product of products) {
			const colorOption = this.getOption(
				product.options || [],
				TextileOptionName.COLOR,
			);
			if (!colorOption) continue;
			for (const value of colorOption.values) {
				const mediaId = value.mediaIds?.[0];
				if (mediaId) ids.add(mediaId);
			}
		}
		return [...ids];
	}

	private getCombinationValue(
		combination: Record<string, string>,
		keys: string[],
	): string {
		for (const key of keys) {
			if (combination[key]) return combination[key];
		}
		return '';
	}

	private resolveOptionLabel(
		option: TextileOptions | undefined,
		combinationValue: string,
	): { label: string; alternativeId?: string } {
		if (!option || !combinationValue) return { label: '' };
		const optionValue = option.values.find((v) => v.label === combinationValue);
		return {
			label: optionValue?.label || combinationValue,
			alternativeId: optionValue?.idOpcionAlternative,
		};
	}

	private buildColorObject(
		colorOption: TextileOptions | undefined,
		combinationValue: string,
		colorAltById: Map<string, { nameLabel: string; hexCode: string }>,
		mediaUrlById: Map<string, string>,
	): TextileAvailableColor {
		if (!colorOption || !combinationValue) {
			return { color: '', hexCode: '#000000', imgUrl: '' };
		}
		const optionValue = colorOption.values.find(
			(v) => v.label === combinationValue,
		);
		if (!optionValue) {
			return { color: combinationValue, hexCode: '#000000', imgUrl: '' };
		}
		const colorAlt = optionValue.idOpcionAlternative
			? colorAltById.get(optionValue.idOpcionAlternative)
			: undefined;
		const colorName = (colorAlt?.nameLabel || optionValue.label || '').trim();
		const firstMediaId = optionValue.mediaIds?.[0];
		const mediaUrl = firstMediaId ? mediaUrlById.get(firstMediaId) : undefined;
		return {
			color: colorName,
			hexCode: colorAlt?.hexCode || '#000000',
			imgUrl: mediaUrl ?? '',
		};
	}

	private buildVariantInfo(
		variants: Variant[],
		sizeOption: TextileOptions | undefined,
		colorOption: TextileOptions | undefined,
		materialOption: TextileOptions | undefined,
		sizeAltById: Map<string, { nameLabel: string }>,
		colorAltById: Map<string, { nameLabel: string; hexCode: string }>,
		mediaUrlById: Map<string, string>,
	): TextileVariantInfo[] {
		return variants.map((variant) => {
			const sizeCombo = this.getCombinationValue(variant.combination, [
				TextileOptionName.SIZE,
				'size',
				'Size',
				'talla',
				'Talla',
			]);
			const colorCombo = this.getCombinationValue(variant.combination, [
				TextileOptionName.COLOR,
				'color',
				'Color',
			]);
			const materialCombo = this.getCombinationValue(variant.combination, [
				TextileOptionName.MATERIAL,
				'material',
				'Material',
			]);

			const sizeResolved = this.resolveOptionLabel(sizeOption, sizeCombo);
			const materialResolved = this.resolveOptionLabel(
				materialOption,
				materialCombo,
			);

			return {
				variantId: variant.id,
				size: sizeResolved.alternativeId
					? sizeAltById.get(sizeResolved.alternativeId)?.nameLabel ||
						sizeResolved.label
					: sizeResolved.label,
				color: this.buildColorObject(
					colorOption,
					colorCombo,
					colorAltById,
					mediaUrlById,
				),
				material: materialResolved.label,
				price: variant.price,
				stock: variant.stock,
			};
		});
	}
}
