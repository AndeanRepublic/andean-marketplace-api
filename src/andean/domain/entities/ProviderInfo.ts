import { Language } from '../enums/Language';
import { ConnectionType } from '../enums/ConnectionType';

export class ProviderInfo {
	constructor(
		public id: string,
		public craftType?: string,
		public tagline?: string,
		public shortBio?: string,
		public originPlace?: string,
		public testimonialsOrAwards?: string,

		public workplacePhotoMediaId?: string,
		public presentationVideoMediaId?: string,

		public isPartOfOrganization: boolean = false,
		public organizationName?: string,
		public memberCount?: number,

		public exactLocation?: string,

		public contactAddress?: string,
		public contactPhone?: string,
		public contactEmail?: string,

		public spokenLanguages?: Language[],

		public hasInternetAccess?: boolean,
		public connectionTypes?: ConnectionType[],

		public extendedStory?: string,
		public foundingYear?: number,
		public projectTimeline?: string[],

		public womenArtisanPercentage?: number,

		public includesPeopleWithDisabilities?: boolean,
		public hasYouthInvolvement?: boolean,
		public indirectBeneficiaryChildren?: string,

		public averageArtisanAge?: number,

		public parallelActivities?: string[],
		public programParticipation?: string[],

		public trainingReceived?: string,
	) {}
}
