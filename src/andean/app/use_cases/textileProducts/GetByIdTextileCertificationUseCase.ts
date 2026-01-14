import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileCertificationRepository } from '../../datastore/textileProducts/TextileCertification.repo';
import { TextileCertification } from 'src/andean/domain/entities/textileProducts/TextileCertification';

@Injectable()
export class GetByIdTextileCertificationUseCase {
  constructor(
    @Inject(TextileCertificationRepository)
    private readonly textileCertificationRepository: TextileCertificationRepository,
  ) {}

  async handle(id: string): Promise<TextileCertification> {
    const certificationFound = await this.textileCertificationRepository.getTextileCertificationById(id);
    if (!certificationFound) {
      throw new NotFoundException('Certification not found');
    }
    return certificationFound;
  }
}
