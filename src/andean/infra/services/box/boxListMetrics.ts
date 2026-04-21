import { Box } from '../../../domain/entities/box/Box';
import { Variant } from '../../../domain/entities/Variant';
import { ProductType } from '../../../domain/enums/ProductType';

export type BoxListMetrics = {
	textileCount: number;
	superfoodCount: number;
	fulfillableQuantity: number;
};

/**
 * Misma regla que el listado de boxes: stocks por línea con variantId;
 * fulfillableQuantity = min(stocks) solo si hay exactamente 3 entradas.
 */
export function computeBoxListMetrics(
	box: Box,
	variantMap: Map<string, Variant>,
): BoxListMetrics {
	const stocks: number[] = [];
	for (const p of box.products) {
		if (!p.variantId) continue;
		const variant = variantMap.get(p.variantId);
		const stock = variant
			? Math.max(0, Math.floor(Number(variant.stock ?? 0)))
			: 0;
		stocks.push(stock);
	}

	let fulfillableQuantity = 0;
	if (stocks.length === 3) {
		fulfillableQuantity = Math.min(stocks[0]!, stocks[1]!, stocks[2]!);
	}

	let textileCount = 0;
	let superfoodCount = 0;
	for (const product of box.products) {
		if (!product.variantId) continue;
		const variant = variantMap.get(product.variantId);
		if (!variant) continue;
		if (variant.productType === ProductType.SUPERFOOD) superfoodCount++;
		else if (variant.productType === ProductType.TEXTILE) textileCount++;
	}

	return { textileCount, superfoodCount, fulfillableQuantity };
}
