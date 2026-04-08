export class SuperfoodNutritionalItem {
	constructor(
		public quantityNumber: number, // e.g., 20, 500
		public quantityUnit: 'g' | 'mg' | 'µg' | 'kcal' | 'cal' | 'kJ',
		public nutrient: string, // e.g., "Proteína", "Vitamina C"
		public strikingFeature: string, // Notable characteristic
		public selected: boolean, // If this item is featured
	) {}
}
