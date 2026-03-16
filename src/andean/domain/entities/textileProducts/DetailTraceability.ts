import { ToolUsed } from '../../enums/ToolUsed';

export class DetailTraceability {
	constructor(
		public isHandmade?: boolean,
		public secondaryMaterial?: string[],
		public originProductCommunityId?: string,
		public craftTechniqueId?: string,
		public toolUsed?: ToolUsed,
		public isArtisanExclusive?: boolean,
		public isOriginalCreation?: boolean,
		public isRegisteredDesign?: boolean,
		public isBackorderAvailable?: boolean,
		public leadTime?: number,
		public certificationId?: string,
	) {}
}
