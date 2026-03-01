import { TraceabilityEpoch } from './traceability/TraceabilityEpoch';

export class ProductTraceability {
	constructor(
		public id: string,
		public blockchainLink: string,
		public epochs: TraceabilityEpoch[],
	) {}
}
