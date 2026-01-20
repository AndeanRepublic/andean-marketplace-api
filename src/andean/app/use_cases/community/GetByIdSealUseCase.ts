import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SealRepository } from '../../datastore/community/Seal.repo';
import { Seal } from 'src/andean/domain/entities/community/Seal';

@Injectable()
export class GetByIdSealUseCase {
  constructor(
    @Inject(SealRepository)
    private readonly sealRepository: SealRepository,
  ) {}

  async handle(id: string): Promise<Seal> {
    const sealFound = await this.sealRepository.getById(id);
    if (!sealFound) {
      throw new NotFoundException('Seal not found');
    }
    return sealFound;
  }
}
