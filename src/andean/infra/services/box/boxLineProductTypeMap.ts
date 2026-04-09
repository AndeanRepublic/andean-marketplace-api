import { BoxProductType } from '../../../domain/enums/BoxProductType';
import { ProductType } from '../../../domain/enums/ProductType';

/** Mapeo coherente con BoxStockReducer: tipo de línea de caja → ProductType de la variante. */
export const BOX_LINE_TO_PRODUCT_TYPE: Partial<
	Record<BoxProductType, ProductType>
> = {
	[BoxProductType.TEXTILE]: ProductType.TEXTILE,
	[BoxProductType.SUPERFOOD]: ProductType.SUPERFOOD,
};
