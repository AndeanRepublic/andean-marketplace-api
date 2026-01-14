import { Injectable } from '@nestjs/common';
import { SuperfoodCategoryRepository } from '../../../datastore/superfoods/SuperfoodCategory.repo';
import { SuperfoodCategory } from '../../../../domain/entities/superfoods/SuperfoodCategory';

@Injectable()
export class ListSuperfoodCategoriesUseCase {
	constructor(
		private readonly categoryRepository: SuperfoodCategoryRepository,
	) { }

	async handle(): Promise<SuperfoodCategory[]> {
		return await this.categoryRepository.getAllCategories();
	}
}
