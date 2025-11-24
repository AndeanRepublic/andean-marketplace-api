import { TraceabilityEpoch } from './TraceabilityEpoch';

export class Traceability {
  constructor(
    public id: string,
    public productId: string,
    public epochs: TraceabilityEpoch[],
  ) {}
}
