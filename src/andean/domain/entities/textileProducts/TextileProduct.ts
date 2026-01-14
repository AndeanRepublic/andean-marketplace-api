import { TextileProductStatus } from '../../enums/TextileProductStatus';
import { BaseInfo } from './BaseInfo';
import { PriceInventary } from './PriceInventary';
import { Atribute } from './Atribute';

export class TextileProduct {
  constructor(
    public id: string,
    public categoryId: string,
    public status: TextileProductStatus,
    public baseInfo: BaseInfo,
    public priceInventary: PriceInventary,
    public atribute?: Atribute,
  ) {}
}
