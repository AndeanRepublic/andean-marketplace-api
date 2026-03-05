import { Inject, Injectable } from '@nestjs/common';
import { MediaItemRepository } from 'src/andean/app/datastore/MediaItem.repo';
import { Variant } from 'src/andean/domain/entities/Variant';
import { TextileProduct } from 'src/andean/domain/entities/textileProducts/TextileProduct';
import { TextileOptions } from 'src/andean/domain/entities/textileProducts/TextileOptions';
import { TextileOptionName } from 'src/andean/domain/enums/TextileOptionName';
import { ColorOptionAlternativeRepository } from '../../../app/datastore/textileProducts/ColorOptionAlternative.repo';
import { SizeOptionAlternativeRepository } from '../../../app/datastore/textileProducts/SizeOptionAlternative.repo';

export interface TextileAvailableColor {
	color: string;
	hexCode: string;
	imgUrl: string;
}

export interface TextileVariantInfo {
	variantId: string;
	size: string;
	color: string;
	material: string;
	price: number;
	stock: number;
}

export interface TextileProductAttributes {
	availableSizes: string[];
	availableColors: TextileAvailableColor[];
	availableMaterials: string[];
	variantInfo: TextileVariantInfo[];
}

@Injectable()
export class TextileProductAttributesAssembler {
	private readonly storageBaseUrl = process.env.STORAGE_BASE_URL || '';

	constructor(
		@Inject(ColorOptionAlternativeRepository)
		private readonly colorOptionAlternativeRepository: ColorOptionAlternativeRepository,
		@Inject(SizeOptionAlternativeRepository)
		private readonly sizeOptionAlternativeRepository: SizeOptionAlternativeRepository,
		@Inject(MediaItemRepository)
		private readonly mediaItemRepository: MediaItemRepository,
	) {}

	async buildForProduct(
		product: Pick<TextileProduct, 'id' | 'options'>,
		variants: Variant[],
	): Promise<TextileProductAttributes> {
		const map = await this.buildForProducts([product], variants);
		return (
			map.get(product.id) || {
				availableSizes: [],
				availableColors: [],
				availableMaterials: [],
				variantInfo: [],
			}
		);
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
		const mediaItems =
			mediaIds.length > 0
				? await this.mediaItemRepository.getByIds(mediaIds)
				: [];
		const mediaById = new Map(mediaItems.map((item) => [item.id, item]));

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
				availableSizes: this.buildAvailableSizes(sizeOption, sizeAltById),
				availableColors: this.buildAvailableColors(
					colorOption,
					colorAltById,
					mediaById,
				),
				availableMaterials: this.buildAvailableMaterials(materialOption),
				variantInfo: this.buildVariantInfo(
					productVariants,
					sizeOption,
					colorOption,
					materialOption,
					sizeAltById,
					colorAltById,
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

	private buildAvailableSizes(
		sizeOption: TextileOptions | undefined,
		sizeAltById: Map<string, { nameLabel: string }>,
	): string[] {
		if (!sizeOption) return [];
		const out: string[] = [];
		const seen = new Set<string>();
		for (const value of sizeOption.values) {
			const sizeAlt = value.idOpcionAlternative
				? sizeAltById.get(value.idOpcionAlternative)
				: undefined;
			const label = (sizeAlt?.nameLabel || value.label || '').trim();
			const key = label.toLowerCase();
			if (!key || seen.has(key)) continue;
			out.push(label);
			seen.add(key);
		}
		return out;
	}

	private buildAvailableColors(
		colorOption: TextileOptions | undefined,
		colorAltById: Map<string, { nameLabel: string; hexCode: string }>,
		mediaById: Map<string, { key: string }>,
	): TextileAvailableColor[] {
		if (!colorOption) return [];
		const out: TextileAvailableColor[] = [];
		const seen = new Set<string>();
		for (const value of colorOption.values) {
			const colorAlt = value.idOpcionAlternative
				? colorAltById.get(value.idOpcionAlternative)
				: undefined;
			const color = (colorAlt?.nameLabel || value.label || '').trim();
			const key = color.toLowerCase();
			if (!key || seen.has(key)) continue;
			const firstMediaId = value.mediaIds?.[0];
			const media = firstMediaId ? mediaById.get(firstMediaId) : undefined;
			out.push({
				color,
				hexCode: colorAlt?.hexCode || '#000000',
				imgUrl: media ? `${this.storageBaseUrl}/${media.key}` : '',
			});
			seen.add(key);
		}
		return out;
	}

	private buildAvailableMaterials(
		materialOption: TextileOptions | undefined,
	): string[] {
		if (!materialOption) return [];
		const out: string[] = [];
		const seen = new Set<string>();
		for (const value of materialOption.values) {
			const label = (value.label || '').trim();
			const key = label.toLowerCase();
			if (!key || seen.has(key)) continue;
			out.push(label);
			seen.add(key);
		}
		return out;
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

	private buildVariantInfo(
		variants: Variant[],
		sizeOption: TextileOptions | undefined,
		colorOption: TextileOptions | undefined,
		materialOption: TextileOptions | undefined,
		sizeAltById: Map<string, { nameLabel: string }>,
		colorAltById: Map<string, { nameLabel: string }>,
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
			const colorResolved = this.resolveOptionLabel(colorOption, colorCombo);
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
				color: colorResolved.alternativeId
					? colorAltById.get(colorResolved.alternativeId)?.nameLabel ||
						colorResolved.label
					: colorResolved.label,
				material: materialResolved.label,
				price: variant.price,
				stock: variant.stock,
			};
		});
	}
}
