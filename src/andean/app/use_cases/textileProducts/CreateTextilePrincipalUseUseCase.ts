import { Inject, Injectable } from '@nestjs/common';
import { TextilePrincipalUseRepository } from '../../datastore/textileProducts/TextilePrincipalUse.repo';
import { CreateTextilePrincipalUseDto } from 'src/andean/infra/controllers/dto/textileProducts/CreateTextilePrincipalUseDto';
import { TextilePrincipalUse } from 'src/andean/domain/entities/textileProducts/TextilePrincipalUse';
import { TextilePrincipalUseMapper } from 'src/andean/infra/services/textileProducts/TextilePrincipalUseMapper';

@Injectable()
export class CreateTextilePrincipalUseUseCase {
  constructor(
    @Inject(TextilePrincipalUseRepository)
    private readonly textilePrincipalUseRepository: TextilePrincipalUseRepository,
  ) {}

  async handle(dto: CreateTextilePrincipalUseDto): Promise<TextilePrincipalUse> {
    const textilePrincipalUseToSave = TextilePrincipalUseMapper.fromCreateDto(dto);
    return this.textilePrincipalUseRepository.saveTextilePrincipalUse(textilePrincipalUseToSave);
  }
}
