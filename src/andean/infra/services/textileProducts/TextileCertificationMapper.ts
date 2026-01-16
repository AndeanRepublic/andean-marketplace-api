import { TextileCertificationDocument } from '../../persistence/textileProducts/textileCertification.schema';
import { TextileCertification } from '../../../domain/entities/textileProducts/TextileCertification';
import { CreateTextileCertificationDto } from '../../controllers/dto/textileProducts/CreateTextileCertificationDto';
import * as crypto from 'crypto';

export class TextileCertificationMapper {
  static fromDocument(doc: TextileCertificationDocument): TextileCertification {
    return new TextileCertification(
      doc.id,
      doc.name,
      doc.createdAt,
      doc.updatedAt,
    );
  }

  static fromCreateDto(dto: CreateTextileCertificationDto): TextileCertification {
    return new TextileCertification(
      crypto.randomUUID(),
      dto.name,
      new Date(),
      new Date(),
    );
  }

  static fromUpdateDto(
    id: string,
    dto: CreateTextileCertificationDto,
  ): TextileCertification {
    return new TextileCertification(id, dto.name, new Date(), new Date());
  }

  static toPersistence(entity: TextileCertification): any {
    const { _id, ...rest } = entity as any;
    return rest;
  }
}
