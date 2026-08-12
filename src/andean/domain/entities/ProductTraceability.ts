import { TraceabilityEpoch } from './traceability/TraceabilityEpoch';

export class ProductTraceability {
	constructor(
		public id: string,
		public blockchainActive: boolean,
		public epochs: TraceabilityEpoch[],
		public hasTraceabilityEpochs: boolean = false,
	) {}
}
