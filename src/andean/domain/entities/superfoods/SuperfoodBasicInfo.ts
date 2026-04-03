import { OwnerType } from '../../enums/OwnerType';
import { SuperfoodProductMedia } from './SuperfoodProductMedia';

export class SuperfoodBasicInfo {
	constructor(
		public title: string,
		public productMedia: SuperfoodProductMedia,
		public shortDescription: string,
		public detailedDescription: string,
		public general_features: string[], // Array of feature descriptions
		public nutritional_features: string[], // Array of IDs referencing SuperfoodNutritionalFeaturesItems
		public benefits: string[], // Array of IDs referencing SuperfoodBenefitItems
		public ownerType: OwnerType,
		public ownerId: string, // Shop ID or Community ID
	) {}
}
