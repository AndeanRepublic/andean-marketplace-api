import { Injectable } from '@nestjs/common';
import { SuperfoodCategoryRepository } from '../../../datastore/superfoods/SuperfoodCategory.repo';
import { SuperfoodCategory } from '../../../../domain/entities/superfoods/SuperfoodCategory';
import { SuperfoodCategoryResponse } from '../../../modules/SuperfoodCategoryResponse';
import { SuperfoodCategoryMapper } from '../../../../infra/services/superfood/SuperfoodCategoryMapper';

@Injectable()
export class ListSuperfoodCategoriesUseCase {
	constructor(
		private readonly categoryRepository: SuperfoodCategoryRepository,
	) { }

	async handle(): Promise<SuperfoodCategoryResponse[]> {
		const categories = await this.categoryRepository.getAllCategories();
		return categories.map(category => SuperfoodCategoryMapper.toResponse(category));
	}
}
