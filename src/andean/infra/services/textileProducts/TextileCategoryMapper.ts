import { TextileCategory } from 'src/andean/domain/entities/textileProducts/TextileCategory';
import { TextileCategoryDocument } from '../../persistence/textileProducts/textileCategory.schema';
import {
  instanceToPlain,
  plainToInstance,
  classToPlain,
} from 'class-transformer';
import { CreateTextileCategoryDto } from '../../controllers/dto/textileProducts/CreateTextileCategory';

export class TextileCategoryMapper {
  static fromDocument(doc: TextileCategoryDocument): TextileCategory {
    const plain = doc.toObject();
    const { _id, ...rest } = plain;
    return plainToInstance(TextileCategory, rest);
  }

  static fromCreateDto(dto: CreateTextileCategoryDto): TextileCategory {
    const { ...textileCategoryData } = dto;
    const plain = {
      id: crypto.randomUUID(),
      ...textileCategoryData,
    };
    return plainToInstance(TextileCategory, plain);
  }

  static fromUpdateDto(
    id: string,
    dto: CreateTextileCategoryDto,
  ): TextileCategory {
    const { ...textileCategoryData } = dto;
    const plain = {
      id: id,
      ...textileCategoryData,
    };
    return plainToInstance(TextileCategory, plain);
  }

  static toPersistence(textileCategory: TextileCategory) {
    const plain = instanceToPlain(textileCategory);
    const { _id, ...updateData } = plain;

    return {
      ...updateData,
    };
  }
}
