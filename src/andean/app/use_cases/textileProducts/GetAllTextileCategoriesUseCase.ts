import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileCategoryRepository } from '../../datastore/textileProducts/TextileCategory.repo';
import { TextileCategory } from 'src/andean/domain/entities/textileProducts/TextileCategory';

@Injectable()
export class GetAllTextileCategoriesUseCase {
	constructor(
		@Inject(TextileCategoryRepository)
		private readonly textileCategoryRepository: TextileCategoryRepository,
	) {}

	async handle(): Promise<TextileCategory[]> {
		const categories = await this.textileCategoryRepository.getAllCategories();
		if (categories.length === 0) {
			throw new NotFoundException('No categories found');
		}
		return categories;
	}
}
