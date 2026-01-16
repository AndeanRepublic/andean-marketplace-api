import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextilePrincipalUseRepository } from '../../datastore/textileProducts/TextilePrincipalUse.repo';
import { TextilePrincipalUse } from 'src/andean/domain/entities/textileProducts/TextilePrincipalUse';
import { TextilePrincipalUseMapper } from 'src/andean/infra/services/textileProducts/TextilePrincipalUseMapper';
import { CreateTextilePrincipalUseDto } from 'src/andean/infra/controllers/dto/textileProducts/CreateTextilePrincipalUseDto';

@Injectable()
export class UpdateTextilePrincipalUseUseCase {
  constructor(
    @Inject(TextilePrincipalUseRepository)
    private readonly textilePrincipalUseRepository: TextilePrincipalUseRepository,
  ) {}

  async handle(id: string, dto: CreateTextilePrincipalUseDto): Promise<TextilePrincipalUse> {
    const principalUseFound = await this.textilePrincipalUseRepository.getTextilePrincipalUseById(id);
    if (!principalUseFound) {
      throw new NotFoundException('Principal use not found');
    }
    const toUpdate = TextilePrincipalUseMapper.fromUpdateDto(id, dto);
    return this.textilePrincipalUseRepository.updateTextilePrincipalUse(id, toUpdate);
  }
}
