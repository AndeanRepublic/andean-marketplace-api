import { TextileProductStatus } from '../../enums/TextileProductStatus';
import { BaseInfo } from './BaseInfo';
import { PriceInventary } from './PriceInventary';
import { Atribute } from './Atribute';
import { DetailTraceability } from './DetailTraceability';
import { ProductTraceability } from '../ProductTraceability';
import { TextileOptions } from './TextileOptions';
import { TextileVariant } from './TextileVariant';

export class TextileProduct {
  constructor(
    public id: string,
    public categoryId: string,
    public status: TextileProductStatus,
    public baseInfo: BaseInfo,
    public priceInventary: PriceInventary,
    public detailTraceability: DetailTraceability,
    public productTraceability: ProductTraceability | null,
    public options: TextileOptions[],
    public variants: TextileVariant[],
    public createdAt: Date,
    public updatedAt: Date,

    public atribute?: Atribute,
  ) {}
}
