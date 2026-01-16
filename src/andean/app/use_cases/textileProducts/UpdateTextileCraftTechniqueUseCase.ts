import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileCraftTechniqueRepository } from '../../datastore/textileProducts/TextileCraftTechnique.repo';
import { TextileCraftTechnique } from 'src/andean/domain/entities/textileProducts/TextileCraftTechnique';
import { TextileCraftTechniqueMapper } from 'src/andean/infra/services/textileProducts/TextileCraftTechniqueMapper';
import { CreateTextileCraftTechniqueDto } from 'src/andean/infra/controllers/dto/textileProducts/CreateTextileCraftTechniqueDto';

@Injectable()
export class UpdateTextileCraftTechniqueUseCase {
  constructor(
    @Inject(TextileCraftTechniqueRepository)
    private readonly textileCraftTechniqueRepository: TextileCraftTechniqueRepository,
  ) {}

  async handle(id: string, dto: CreateTextileCraftTechniqueDto): Promise<TextileCraftTechnique> {
    const techniqueFound = await this.textileCraftTechniqueRepository.getTextileCraftTechniqueById(id);
    if (!techniqueFound) {
      throw new NotFoundException('Craft technique not found');
    }
    const toUpdate = TextileCraftTechniqueMapper.fromUpdateDto(id, dto);
    return this.textileCraftTechniqueRepository.updateTextileCraftTechnique(id, toUpdate);
  }
}
