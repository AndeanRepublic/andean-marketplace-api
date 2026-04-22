import { Injectable } from '@nestjs/common';
import { TextileProduct } from '../../../domain/entities/textileProducts/TextileProduct';
import { Variant } from '../../../domain/entities/Variant';

/**
 * Resuelve un mediaId representativo para mostrar una variante textil en pickers (color u otra opción con imagen).
 */
@Injectable()
export class TextileVariantPickerMediaService {
	resolveVariantMainMediaId(
		product: TextileProduct,
		variant: Variant,
	): string | null {
		const comb = variant.combination || {};
		for (const opt of product.options ?? []) {
			const key = opt.name;
			const raw =
				comb[key] ??
				comb[String(key).toUpperCase()] ??
				comb[String(key).toLowerCase()];
			if (raw == null || String(raw).trim() === '') continue;
			const needle = String(raw).trim();
			const val = opt.values.find(
				(v) =>
					v.label === needle ||
					(v.idOpcionAlternative != null && v.idOpcionAlternative === needle),
			);
			const firstMedia = val?.mediaIds?.find((id) => id?.trim());
			if (firstMedia) return firstMedia.trim();
		}
		const fallback = product.baseInfo?.mediaIds?.find((id) => id?.trim());
		return fallback?.trim() ?? null;
	}

	buildVariantLabel(variant: Variant): string {
		const entries = Object.entries(variant.combination || {});
		if (entries.length === 0) return 'Variante';
		return entries.map(([k, v]) => `${k}: ${v}`).join(' · ');
	}
}
