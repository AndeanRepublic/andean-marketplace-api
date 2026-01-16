import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileCertificationRepository } from '../../datastore/textileProducts/TextileCertification.repo';
import { TextileCertification } from 'src/andean/domain/entities/textileProducts/TextileCertification';

@Injectable()
export class GetAllTextileCertificationsUseCase {
  constructor(
    @Inject(TextileCertificationRepository)
    private readonly textileCertificationRepository: TextileCertificationRepository,
  ) {}

  async handle(): Promise<TextileCertification[]> {
    const certifications = await this.textileCertificationRepository.getAllTextileCertifications();
    if (certifications.length === 0) {
      throw new NotFoundException('No certifications found');
    }
    return certifications;
  }
}
