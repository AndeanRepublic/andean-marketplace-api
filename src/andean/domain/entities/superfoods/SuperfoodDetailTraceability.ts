import { SuperfoodProductionMethod } from '../../enums/SuperfoodProductionMethod';

export class Origin {
	constructor(
		public department: string,
		public province: string,
		public district: string,
	) { }
}

export class SuperfoodDetailTraceability {
	constructor(
		public handmade: boolean,
		public secondaryMaterials: string[],          // Additional materials used
		public origin: Origin,
		public productionMethod: SuperfoodProductionMethod,  // AGROECOLOGICO | ORGANICO | CONVENCIONAL
		public preservationMethod: string,             // ID reference to SuperfoodPreservationMethodItems
		public isArtesanal: boolean,
		public isNatural: boolean,
		public isEatableWithoutPrep: boolean,
		public canCauseAllergies: boolean,
		public certification: string,                  // ID reference to SuperfoodCertificationItems
	) { }
}
