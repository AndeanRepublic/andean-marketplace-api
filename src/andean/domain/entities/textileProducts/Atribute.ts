import { Gender } from '../../enums/Gender';
import { Season } from '../../enums/Season';
import { PreparationTime } from './PreparationTime';

export class Atribute {
  constructor(
    public textileTypeId: string,
    public subcategoryId: string,
    public gender: Gender,
    public textileStyleId: string,
    public season: Season,
    public principalUse: string[],
    public preparationTime: PreparationTime,
  ) {}
}
