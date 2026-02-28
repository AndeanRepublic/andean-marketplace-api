import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileCategoryRepository } from '../../datastore/textileProducts/TextileCategory.repo';
import { TextileCategory } from 'src/andean/domain/entities/textileProducts/TextileCategory';

@Injectable()
export class GetByIdTextileCategoryUseCase {
	constructor(
		@Inject(TextileCategoryRepository)
		private readonly textileCategoryRepository: TextileCategoryRepository,
	) {}

	async handle(id: string): Promise<TextileCategory> {
		const categoryFound =
			await this.textileCategoryRepository.getCategoryById(id);
		if (!categoryFound) {
			throw new NotFoundException('Category not found');
		}
		return categoryFound;
	}
}
