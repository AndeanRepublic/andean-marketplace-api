import { SuperfoodOwnerType } from '../../enums/SuperfoodOwnerType';

export class SuperfoodBasicInfo {
	constructor(
		public title: string,
		public mediaIds: string[], // Array of IDs referencing MediaItem collection
		public shortDescription: string,
		public detailedDescription: string,
		public general_features: string[], // Array of feature descriptions
		public nutritional_features: string[], // Array of IDs referencing SuperfoodNutritionalFeaturesItems
		public benefits: string[], // Array of IDs referencing SuperfoodBenefitItems
		public ownerType: SuperfoodOwnerType, // SHOP | COMMUNITY
		public ownerId: string, // Shop ID or Community ID
	) {}
}
