import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileCraftTechniqueRepository } from '../../datastore/textileProducts/TextileCraftTechnique.repo';
import { TextileCraftTechnique } from 'src/andean/domain/entities/textileProducts/TextileCraftTechnique';

@Injectable()
export class GetAllTextileCraftTechniquesUseCase {
  constructor(
    @Inject(TextileCraftTechniqueRepository)
    private readonly textileCraftTechniqueRepository: TextileCraftTechniqueRepository,
  ) {}

  async handle(): Promise<TextileCraftTechnique[]> {
    const techniques = await this.textileCraftTechniqueRepository.getAllTextileCraftTechniques();
    if (techniques.length === 0) {
      throw new NotFoundException('No craft techniques found');
    }
    return techniques;
  }
}
