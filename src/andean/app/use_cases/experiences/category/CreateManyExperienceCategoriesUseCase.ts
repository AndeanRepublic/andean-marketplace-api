import { Inject, Injectable } from '@nestjs/common';
import { ExperienceCategoryRepository } from '../../../datastore/experiences/ExperienceCategory.repo';
import { CreateManyExperienceCategoriesDto } from '../../../../infra/controllers/dto/experiences/CreateManyExperienceCategoriesDto';
import { ExperienceCategoryResponse } from '../../../models/experiences/ExperienceCategoryResponse';
import { ExperienceCategoryMapper } from '../../../../infra/services/experiences/ExperienceCategoryMapper';

@Injectable()
export class CreateManyExperienceCategoriesUseCase {
	constructor(
		@Inject(ExperienceCategoryRepository)
		private readonly categoryRepository: ExperienceCategoryRepository,
	) {}

	async handle(
		dto: CreateManyExperienceCategoriesDto,
	): Promise<ExperienceCategoryResponse[]> {
		const toSave = dto.experienceCategories.map((item) =>
			ExperienceCategoryMapper.fromCreateDto(item),
		);
		const saved = await this.categoryRepository.saveManyCategories(toSave);
		return saved.map((category) => ExperienceCategoryMapper.toResponse(category));
	}
}
