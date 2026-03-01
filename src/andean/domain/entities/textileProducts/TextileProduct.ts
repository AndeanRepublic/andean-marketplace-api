import { TextileProductStatus } from '../../enums/TextileProductStatus';
import { BaseInfo } from './BaseInfo';
import { PriceInventary } from './PriceInventary';
import { Atribute } from './Atribute';
import { DetailTraceability } from './DetailTraceability';
import { ProductTraceability } from '../ProductTraceability';
import { TextileOptions } from './TextileOptions';

export class TextileProduct {
	constructor(
		public id: string,

		public status: TextileProductStatus,
		public baseInfo: BaseInfo,
		public priceInventary: PriceInventary,
		public createdAt: Date,
		public updatedAt: Date,
		public isDiscountActive: boolean,

		public categoryId?: string,
		public atribute?: Atribute,
		public detailTraceability?: DetailTraceability,
		public productTraceability?: ProductTraceability,
		public options?: TextileOptions[],
	) {}
}
