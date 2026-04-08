import { SuperfoodOptionsItem } from './SuperfoodOptionsItem';
import { SuperfoodOptionName } from '../../enums/SuperfoodOptionName';

export class SuperfoodOptions {
	constructor(
		public name: SuperfoodOptionName,
		public values: SuperfoodOptionsItem[], // Array of option items
	) {}
}
