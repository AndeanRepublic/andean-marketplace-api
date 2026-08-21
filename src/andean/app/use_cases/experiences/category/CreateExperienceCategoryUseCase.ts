import { Inject, Injectable } from '@nestjs/common';
import { ExperienceCategoryRepository } from '../../../datastore/experiences/ExperienceCategory.repo';
import { CreateExperienceCategoryDto } from '../../../../infra/controllers/dto/experiences/CreateExperienceCategoryDto';
import { ExperienceCategoryResponse } from '../../../models/experiences/ExperienceCategoryResponse';
import { ExperienceCategoryMapper } from '../../../../infra/services/experiences/ExperienceCategoryMapper';

@Injectable()
export class CreateExperienceCategoryUseCase {
	constructor(
		@Inject(ExperienceCategoryRepository)
		private readonly categoryRepository: ExperienceCategoryRepository,
	) {}

	async handle(
		dto: CreateExperienceCategoryDto,
	): Promise<ExperienceCategoryResponse> {
		const category = ExperienceCategoryMapper.fromCreateDto(dto);
		const saved = await this.categoryRepository.saveCategory(category);
		return ExperienceCategoryMapper.toResponse(saved);
	}
}
