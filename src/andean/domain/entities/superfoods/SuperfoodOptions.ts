import { SuperfoodOptionsItem } from './SuperfoodOptionsItem';

export class SuperfoodOptions {
	constructor(
		public id: string,
		public name: string, // e.g., "Color", "Tamaño"
		public values: SuperfoodOptionsItem[], // Array of option items
	) {}
}
