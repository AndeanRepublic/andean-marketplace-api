import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextilePrincipalUseRepository } from '../../datastore/textileProducts/TextilePrincipalUse.repo';
import { TextilePrincipalUse } from 'src/andean/domain/entities/textileProducts/TextilePrincipalUse';

@Injectable()
export class DeleteTextilePrincipalUseUseCase {
  constructor(
    @Inject(TextilePrincipalUseRepository)
    private readonly textilePrincipalUseRepository: TextilePrincipalUseRepository,
  ) {}

  async handle(id: string): Promise<void> {
    const principalUseFound = await this.textilePrincipalUseRepository.getTextilePrincipalUseById(id);
    if (!principalUseFound) {
      throw new NotFoundException('Principal use not found');
    }
    await this.textilePrincipalUseRepository.deleteTextilePrincipalUse(id);
    return;
  }
}
