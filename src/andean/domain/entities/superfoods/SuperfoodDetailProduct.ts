import { SuperfoodConsumptionWay } from '../../enums/SuperfoodConsumptionWay';
import { SuperfoodElaborationTime } from './SuperfoodElaborationTime';

export class SuperfoodDetailProduct {
	constructor(
		public type: string,                              // ID reference to SuperfoodTypeItems
		public productPresentation: string,               // ID reference to SuperfoodProductPresentationItems
		public consumptionWay: SuperfoodConsumptionWay,   // POLVO | GRANO | EXTRACTO | LIQUIDO | CAPSULA
		public consumptionSuggestions: string,
		public salesUnitSize: string,                     // ID reference to SuperfoodSalesUnitSizeItems
		public medicRecommendations: string,
		public healthWarnings: string,
		public elaborationTime: SuperfoodElaborationTime,
	) { }
}
