import { TextileCraftTechnique } from 'src/andean/domain/entities/textileProducts/TextileCraftTechnique';
import { TextileCraftTechniqueDocument } from '../../persistence/textileProducts/textileCraftTechnique.schema';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { CreateTextileCraftTechniqueDto } from '../../controllers/dto/textileProducts/CreateTextileCraftTechniqueDto';

export class TextileCraftTechniqueMapper {
  static fromDocument(doc: TextileCraftTechniqueDocument): TextileCraftTechnique {
    const plain = doc.toObject();
    const { _id, ...rest } = plain;
    return plainToInstance(TextileCraftTechnique, rest);
  }

  static fromCreateDto(dto: CreateTextileCraftTechniqueDto): TextileCraftTechnique {
    const { ...textileCraftTechniqueData } = dto;
    const plain = {
      id: crypto.randomUUID(),
      ...textileCraftTechniqueData,
    };
    return plainToInstance(TextileCraftTechnique, plain);
  }

  static fromUpdateDto(
    id: string,
    dto: CreateTextileCraftTechniqueDto,
  ): TextileCraftTechnique {
    const { ...textileCraftTechniqueData } = dto;
    const plain = {
      id: id,
      ...textileCraftTechniqueData,
    };
    return plainToInstance(TextileCraftTechnique, plain);
  }

  static toPersistence(textileCraftTechnique: TextileCraftTechnique) {
    const plain = instanceToPlain(textileCraftTechnique);
    const { _id, ...updateData } = plain;

    return {
      ...updateData,
    };
  }
}
