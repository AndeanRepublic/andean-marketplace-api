import { TraceabilityProcessName } from '../../enums/TraceabilityProcessName';

export class TraceabilityEpoch {
	constructor(
		public title: string,
		public country: string,
		public city: string,
		public description: string,
		public processName: TraceabilityProcessName,
		public supplier: string,
	) {}
}
