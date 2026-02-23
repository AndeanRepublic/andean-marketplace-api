// Value Object — no tiene identidad propia, vive embebido en Experience
export class ExperienceDetailInfo {
	constructor(
		public shortDescription: string,
		public largeDescription: string,
		public includes: string[],
		public notIncludes: string[],
		public pickupDetail: string,
		public returnDetail: string,
		public accommodationDetail: string,
		public accessibilityDetail: string,
		public cancellationPolicy: string,
		public shouldCarry?: string[],
		public aditionalInformation?: string[],
		public contactNumber?: string,
	) { }
}
