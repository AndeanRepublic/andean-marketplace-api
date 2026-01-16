import { TextileStyle } from 'src/andean/domain/entities/textileProducts/TextileStyle';
import { TextileStyleDocument } from '../../persistence/textileProducts/textileStyle.schema';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { CreateTextileStyleDto } from '../../controllers/dto/textileProducts/CreateTextileStyleDto';

export class TextileStyleMapper {
  static fromDocument(doc: TextileStyleDocument): TextileStyle {
    const plain = doc.toObject();
    const { _id, ...rest } = plain;
    return plainToInstance(TextileStyle, rest);
  }

  static fromCreateDto(dto: CreateTextileStyleDto): TextileStyle {
    const { ...textileStyleData } = dto;
    const plain = {
      id: crypto.randomUUID(),
      ...textileStyleData,
    };
    return plainToInstance(TextileStyle, plain);
  }

  static fromUpdateDto(id: string, dto: CreateTextileStyleDto): TextileStyle {
    const { ...textileStyleData } = dto;
    const plain = {
      id: id,
      ...textileStyleData,
    };
    return plainToInstance(TextileStyle, plain);
  }

  static toPersistence(textileStyle: TextileStyle) {
    const plain = instanceToPlain(textileStyle);
    const { _id, ...updateData } = plain;

    return {
      ...updateData,
    };
  }
}
