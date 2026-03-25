import { Injectable } from '@nestjs/common';
import { SuperfoodCategoryRepository } from '../../../datastore/superfoods/SuperfoodCategory.repo';
import { CreateManySuperfoodCategoriesDto } from '../../../../infra/controllers/dto/superfoods/CreateManySuperfoodCategoriesDto';
import { SuperfoodCategoryResponse } from '../../../models/superfoods/SuperfoodCategoryResponse';
import { SuperfoodCategoryMapper } from '../../../../infra/services/superfood/SuperfoodCategoryMapper';

@Injectable()
export class CreateManySuperfoodCategoriesUseCase {
	constructor(
		private readonly categoryRepository: SuperfoodCategoryRepository,
	) {}

	async handle(
		dto: CreateManySuperfoodCategoriesDto,
	): Promise<SuperfoodCategoryResponse[]> {
		const categoriesToSave = dto.superfoodCategories.map((itemDto) =>
			SuperfoodCategoryMapper.fromCreateDto(itemDto),
		);
		const savedCategories =
			await this.categoryRepository.saveManyCategories(categoriesToSave);
		return savedCategories.map((category) =>
			SuperfoodCategoryMapper.toResponse(category),
		);
	}
}
