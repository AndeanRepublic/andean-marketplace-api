import { SuperfoodNutritionalItem } from './SuperfoodNutritionalItem';

export class SuperfoodServingNutrition {
	constructor(
		public servingSize: number,
		public servingUnit: 'g' | 'mg',
		public servingNutritionalContent: SuperfoodNutritionalItem[],
	) {}
}
