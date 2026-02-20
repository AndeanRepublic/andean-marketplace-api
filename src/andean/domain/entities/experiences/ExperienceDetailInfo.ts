export class ExperienceDetailInfo {
	constructor(
		public id: string,
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
