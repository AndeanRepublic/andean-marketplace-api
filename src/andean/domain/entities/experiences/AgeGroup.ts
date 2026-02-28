import { AgeGroupCode } from '../../enums/AgeGroupCode';

export class AgeGroup {
	constructor(
		public code: AgeGroupCode,
		public label: string,
		public price: number,
		public minAge?: number,
		public maxAge?: number,
	) {}
}
