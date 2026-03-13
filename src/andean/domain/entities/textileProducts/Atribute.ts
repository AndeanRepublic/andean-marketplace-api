import { Gender } from '../../enums/Gender';
import { Season } from '../../enums/Season';
import { SizeGuide } from '../../enums/SizeGuide';
import { PreparationTime } from './PreparationTime';

export class Atribute {
	constructor(
		public textileTypeId?: string,
		public gender?: Gender,
		public textileStyleId?: string,
		public season?: Season,
		public principalUse?: string[],
		public preparationTime?: PreparationTime,
		public inspiration?: string,
		public sizeGuide?: SizeGuide,
		public careInstructions?: string,
	) {}
}
