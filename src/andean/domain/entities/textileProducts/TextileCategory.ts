import { TextileCategoryStatus } from '../../enums/TextileCategoryStatus';

export class TextileCategory {
	constructor(
		public id: string,
		public name: string,
		public status: TextileCategoryStatus,
	) {}
}
