import { TextilePrincipalUse } from 'src/andean/domain/entities/textileProducts/TextilePrincipalUse';
import { TextilePrincipalUseDocument } from '../../persistence/textileProducts/textilePrincipalUse.schema';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { CreateTextilePrincipalUseDto } from '../../controllers/dto/textileProducts/CreateTextilePrincipalUseDto';

export class TextilePrincipalUseMapper {
  static fromDocument(doc: TextilePrincipalUseDocument): TextilePrincipalUse {
    const plain = doc.toObject();
    const { _id, ...rest } = plain;
    return plainToInstance(TextilePrincipalUse, rest);
  }

  static fromCreateDto(dto: CreateTextilePrincipalUseDto): TextilePrincipalUse {
    const { ...textilePrincipalUseData } = dto;
    const plain = {
      id: crypto.randomUUID(),
      ...textilePrincipalUseData,
    };
    return plainToInstance(TextilePrincipalUse, plain);
  }

  static fromUpdateDto(
    id: string,
    dto: CreateTextilePrincipalUseDto,
  ): TextilePrincipalUse {
    const { ...textilePrincipalUseData } = dto;
    const plain = {
      id: id,
      ...textilePrincipalUseData,
    };
    return plainToInstance(TextilePrincipalUse, plain);
  }

  static toPersistence(textilePrincipalUse: TextilePrincipalUse) {
    const plain = instanceToPlain(textilePrincipalUse);
    const { _id, ...updateData } = plain;

    return {
      ...updateData,
    };
  }
}
