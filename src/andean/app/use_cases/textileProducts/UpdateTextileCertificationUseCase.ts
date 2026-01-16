import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileCertificationRepository } from '../../datastore/textileProducts/TextileCertification.repo';
import { TextileCertification } from 'src/andean/domain/entities/textileProducts/TextileCertification';
import { TextileCertificationMapper } from 'src/andean/infra/services/textileProducts/TextileCertificationMapper';
import { CreateTextileCertificationDto } from 'src/andean/infra/controllers/dto/textileProducts/CreateTextileCertificationDto';

@Injectable()
export class UpdateTextileCertificationUseCase {
  constructor(
    @Inject(TextileCertificationRepository)
    private readonly textileCertificationRepository: TextileCertificationRepository,
  ) {}

  async handle(id: string, dto: CreateTextileCertificationDto): Promise<TextileCertification> {
    const certificationFound = await this.textileCertificationRepository.getTextileCertificationById(id);
    if (!certificationFound) {
      throw new NotFoundException('Certification not found');
    }
    const toUpdate = TextileCertificationMapper.fromUpdateDto(id, dto);
    return this.textileCertificationRepository.updateTextileCertification(id, toUpdate);
  }
}
