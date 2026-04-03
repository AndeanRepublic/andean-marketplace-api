import { SuperfoodConsumptionWay } from '../../enums/SuperfoodConsumptionWay';

export class SuperfoodDetailProduct {
	constructor(
		public type?: string,
		public productPresentation?: string,
		public consumptionWay?: SuperfoodConsumptionWay,
		public consumptionSuggestions?: string,
		public salesUnitSize?: string,
		public medicRecommendations?: string,
		public healthWarnings?: string,
		public ingredients?: string,
		public customerExpectations?: string,
	) {}
}
