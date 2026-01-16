import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileSubcategoryRepository } from '../../datastore/textileProducts/TextileSubcategory.repo';
import { TextileSubcategory } from 'src/andean/domain/entities/textileProducts/TextileSubcategory';

@Injectable()
export class GetByIdTextileSubcategoryUseCase {
  constructor(
    @Inject(TextileSubcategoryRepository)
    private readonly textileSubcategoryRepository: TextileSubcategoryRepository,
  ) {}

  async handle(id: string): Promise<TextileSubcategory> {
    const subcategoryFound = await this.textileSubcategoryRepository.getTextileSubcategoryById(id);
    if (!subcategoryFound) {
      throw new NotFoundException('Subcategory not found');
    }
    return subcategoryFound;
  }
}
