import { TextileStyle } from '../../../domain/entities/textileProducts/TextileStyle';

export abstract class TextileStyleRepository {
  abstract getAllTextileStyles(): Promise<TextileStyle[]>;
  abstract getTextileStyleById(id: string): Promise<TextileStyle | null>;
  abstract saveTextileStyle(style: TextileStyle): Promise<TextileStyle>;
  abstract updateTextileStyle(
    id: string,
    style: TextileStyle,
  ): Promise<TextileStyle>;
  abstract deleteTextileStyle(id: string): Promise<void>;
}
