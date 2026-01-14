import { Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodCategoryRepository } from '../../../datastore/superfoods/SuperfoodCategory.repo';
import { SuperfoodCategory } from '../../../../domain/entities/superfoods/SuperfoodCategory';
import { SuperfoodCategoryResponse } from '../../../modules/SuperfoodCategoryResponse';

@Injectable()
export class GetSuperfoodCategoryByIdUseCase {
	constructor(
		private readonly categoryRepository: SuperfoodCategoryRepository,
	) { }

	async handle(id: string): Promise<SuperfoodCategoryResponse> {
		const category = await this.categoryRepository.getCategoryById(id);

		if (!category) {
			throw new NotFoundException(`SuperfoodCategory with ID ${id} not found`);
		}

		return {
			id: category.id,
			name: category.name,
			status: category.status,
			createdAt: category.createdAt!,
			updatedAt: category.updatedAt!,
		};
	}
}
