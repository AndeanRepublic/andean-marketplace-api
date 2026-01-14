import { Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodCategoryRepository } from '../../../datastore/superfoods/SuperfoodCategory.repo';
import { SuperfoodCategory } from '../../../../domain/entities/superfoods/SuperfoodCategory';

@Injectable()
export class GetSuperfoodCategoryByIdUseCase {
	constructor(
		private readonly categoryRepository: SuperfoodCategoryRepository,
	) { }

	async handle(id: string): Promise<SuperfoodCategory> {
		const category = await this.categoryRepository.getCategoryById(id);

		if (!category) {
			throw new NotFoundException(`SuperfoodCategory with ID ${id} not found`);
		}

		return category;
	}
}
