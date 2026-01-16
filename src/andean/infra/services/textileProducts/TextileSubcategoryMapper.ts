import { TextileSubcategory } from 'src/andean/domain/entities/textileProducts/TextileSubcategory';
import { TextileSubcategoryDocument } from '../../persistence/textileProducts/textileSubcategory.schema';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { CreateTextileSubcategoryDto } from '../../controllers/dto/textileProducts/CreateTextileSubcategoryDto';

export class TextileSubcategoryMapper {
  static fromDocument(doc: TextileSubcategoryDocument): TextileSubcategory {
    const plain = doc.toObject();
    const { _id, ...rest } = plain;
    return plainToInstance(TextileSubcategory, rest);
  }

  static fromCreateDto(dto: CreateTextileSubcategoryDto): TextileSubcategory {
    const { ...textileSubcategoryData } = dto;
    const plain = {
      id: crypto.randomUUID(),
      ...textileSubcategoryData,
    };
    return plainToInstance(TextileSubcategory, plain);
  }

  static fromUpdateDto(
    id: string,
    dto: CreateTextileSubcategoryDto,
  ): TextileSubcategory {
    const { ...textileSubcategoryData } = dto;
    const plain = {
      id: id,
      ...textileSubcategoryData,
    };
    return plainToInstance(TextileSubcategory, plain);
  }

  static toPersistence(textileSubcategory: TextileSubcategory) {
    const plain = instanceToPlain(textileSubcategory);
    const { _id, ...updateData } = plain;

    return {
      ...updateData,
    };
  }
}
