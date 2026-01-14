import { ProductType } from '../enums/ProductType';
import { TraceabilityEpoch } from './traceability/TraceabilityEpoch';

export class ProductTraceability {
	constructor(
		public id: string,
		public productId: string,
		public productType: ProductType,
		public blockchainLink: string,
		public epochs: TraceabilityEpoch[],
	) { }
}
