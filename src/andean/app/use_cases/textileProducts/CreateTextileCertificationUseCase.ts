import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { TextileCertificationRepository } from '../../datastore/textileProducts/TextileCertification.repo';
import { CreateTextileCertificationDto } from 'src/andean/infra/controllers/dto/textileProducts/CreateTextileCertificationDto';
import { TextileCertification } from 'src/andean/domain/entities/textileProducts/TextileCertification';
import { TextileCertificationMapper } from 'src/andean/infra/services/textileProducts/TextileCertificationMapper';

@Injectable()
export class CreateTextileCertificationUseCase {
  constructor(
    @Inject(TextileCertificationRepository)
    private readonly textileCertificationRepository: TextileCertificationRepository,
  ) {}

  async handle(dto: CreateTextileCertificationDto): Promise<TextileCertification> {
    const certificationFound = await this.textileCertificationRepository.getTextileCertificationByName(
      dto.name,
    );
    if (certificationFound) {
      throw new BadRequestException('Certification already exists');
    }
    const textileCertificationToSave = TextileCertificationMapper.fromCreateDto(dto);
    return this.textileCertificationRepository.saveTextileCertification(textileCertificationToSave);
  }
}
