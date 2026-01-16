import { TextileType } from '../../../domain/entities/textileProducts/TextileType';

export abstract class TextileTypeRepository {
  abstract getAllTextileTypes(): Promise<TextileType[]>;
  abstract getTextileTypeById(id: string): Promise<TextileType | null>;
  abstract saveTextileType(type: TextileType): Promise<TextileType>;
  abstract updateTextileType(
    id: string,
    type: TextileType,
  ): Promise<TextileType>;
  abstract deleteTextileType(id: string): Promise<void>;
}
