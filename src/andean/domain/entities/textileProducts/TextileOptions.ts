import { TextileOptionsItem } from './TextileOptionsItem';
import { TextileOptionName } from '../../enums/TextileOptionName';

export class TextileOptions {
	constructor(
		public name: TextileOptionName,
		public values: TextileOptionsItem[],
	) {}
}
