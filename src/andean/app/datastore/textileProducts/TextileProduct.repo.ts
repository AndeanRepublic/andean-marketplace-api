import { TextileProduct } from '../../../domain/entities/textileProducts/TextileProduct';

export abstract class TextileProductRepository {
  abstract getAllTextileProducts(): Promise<TextileProduct[]>;
  abstract getTextileProductById(id: string): Promise<TextileProduct | null>;
  abstract saveTextileProduct(product: TextileProduct): Promise<TextileProduct>;
  abstract updateTextileProduct(
    id: string,
    product: TextileProduct,
  ): Promise<TextileProduct>;
  abstract deleteTextileProduct(id: string): Promise<void>;
}
