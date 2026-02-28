import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileCategoryRepository } from '../../datastore/textileProducts/TextileCategory.repo';

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
