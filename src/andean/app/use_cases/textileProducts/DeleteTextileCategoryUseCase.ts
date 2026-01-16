import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileCategoryRepository } from '../../datastore/textileProducts/TextileCategory.repo';
import { TextileCategory } from 'src/andean/domain/entities/textileProducts/TextileCategory';
import { TextileCategoryMapper } from 'src/andean/infra/services/textileProducts/TextileCategoryMapper';

@Injectable()
export class DeleteTextileCategoryUseCase {
  constructor(
    @Inject(TextileCategoryRepository)
    private readonly textileCategoryRepository: TextileCategoryRepository,
  ) {}

  async handle(id: string): Promise<void> {
    const categoryFound =
      await this.textileCategoryRepository.getCategoryById(id);
    if (!categoryFound) {
      throw new NotFoundException('Category not found');
    }
    await this.textileCategoryRepository.deleteCategory(id);
    return;
  }
}
