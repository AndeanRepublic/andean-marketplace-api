import { Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodCategoryRepository } from '../../../datastore/superfoods/SuperfoodCategory.repo';
import { SuperfoodCategoryResponse } from '../../../modules/SuperfoodCategoryResponse';
import { SuperfoodCategoryMapper } from '../../../../infra/services/superfood/SuperfoodCategoryMapper';

@Injectable()
export class GetSuperfoodCategoryByIdUseCase {
	constructor(
		private readonly categoryRepository: SuperfoodCategoryRepository,
	) {}

	async handle(id: string): Promise<SuperfoodCategoryResponse> {
		const category = await this.categoryRepository.getCategoryById(id);

		if (!category) {
			throw new NotFoundException(`SuperfoodCategory with ID ${id} not found`);
		}

		return SuperfoodCategoryMapper.toResponse(category);
	}
}
