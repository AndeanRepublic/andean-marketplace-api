import { Inject, Injectable } from '@nestjs/common';
import { TextileCategoryRepository } from '../../datastore/textileProducts/TextileCategory.repo';
import { CreateTextileCategoryDto } from 'src/andean/infra/controllers/dto/textileProducts/CreateTextileCategory';
import { TextileCategory } from 'src/andean/domain/entities/textileProducts/TextileCategory';
import { TextileCategoryMapper } from 'src/andean/infra/services/textileProducts/TextileCategoryMapper';

@Injectable()
export class CreateTextileCategoryUseCase {
  constructor(
    @Inject(TextileCategoryRepository)
    private readonly textileCategoryRepository: TextileCategoryRepository,
  ) {}

  async handle(dto: CreateTextileCategoryDto): Promise<TextileCategory> {
    const textileCategoryToSave = TextileCategoryMapper.fromCreateDto(dto);
    return this.textileCategoryRepository.saveCategory(textileCategoryToSave);
  }
}
