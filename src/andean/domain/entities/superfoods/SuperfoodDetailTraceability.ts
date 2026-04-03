import { SuperfoodProductionMethod } from '../../enums/SuperfoodProductionMethod';
import { ProductDimensions } from '../ProductDimensions';

export class SuperfoodDetailTraceability {
	constructor(
		public productOrigin?: string,
		public exactSpeciesOrVarietyId?: string,
		public productionMethod?: SuperfoodProductionMethod,
		public preservationMethodId?: string,
		public certificationIds?: string[],
		public sanitaryRegistryNumber?: string,
		public expirationDate?: Date,
		public productionDate?: Date,
		public lotNumber?: string,
		public isNatural?: boolean,
		public isArtesanal?: boolean,
		public isEatableWithoutPrep?: boolean,
		public canCauseAllergies?: boolean,
		public allergens?: string[],
		public primaryPackaging?: string,
		public secondaryPackaging?: string,
		public packagingSpecification?: string,
		public netWeight?: string,
		public grossWeight?: string,
		public dimensionsWithPackage?: ProductDimensions,
		public storageConditions?: string,
		public estimatedDeliveryDays?: number,
		public isCustomizableOrMixable?: boolean,
	) {}
}
