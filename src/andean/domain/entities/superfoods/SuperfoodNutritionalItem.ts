export class SuperfoodNutritionalItem {
	constructor(
		public id: string,
		public quantity: string,           // e.g., "20g", "500mg"
		public nutrient: string,           // e.g., "Proteína", "Vitamina C"
		public strikingFeature: string,    // Notable characteristic
		public selected: boolean,          // If this item is featured
	) { }
}
