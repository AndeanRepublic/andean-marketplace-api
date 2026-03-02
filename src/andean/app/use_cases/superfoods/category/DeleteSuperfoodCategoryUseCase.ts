import { Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodCategoryRepository } from '../../../datastore/superfoods/SuperfoodCategory.repo';

@Injectable()
export class DeleteSuperfoodCategoryUseCase {
	constructor(
		private readonly categoryRepository: SuperfoodCategoryRepository,
	) {}

	async handle(id: string): Promise<void> {
		const category = await this.categoryRepository.getCategoryById(id);

		if (!category) {
			throw new NotFoundException(`SuperfoodCategory with ID ${id} not found`);
		}

		await this.categoryRepository.deleteCategory(id);
	}
}
