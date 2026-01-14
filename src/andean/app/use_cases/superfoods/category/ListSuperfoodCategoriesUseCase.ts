import { Injectable } from '@nestjs/common';
import { SuperfoodCategoryRepository } from '../../../datastore/superfoods/SuperfoodCategory.repo';
import { SuperfoodCategory } from '../../../../domain/entities/superfoods/SuperfoodCategory';
import { SuperfoodCategoryResponse } from '../../../modules/SuperfoodCategoryResponse';

@Injectable()
export class ListSuperfoodCategoriesUseCase {
	constructor(
		private readonly categoryRepository: SuperfoodCategoryRepository,
	) { }

	async handle(): Promise<SuperfoodCategoryResponse[]> {
		const categories = await this.categoryRepository.getAllCategories();
		return categories.map(category => ({
			id: category.id,
			name: category.name,
			status: category.status,
			createdAt: category.createdAt!,
			updatedAt: category.updatedAt!,
		}));
	}
}
