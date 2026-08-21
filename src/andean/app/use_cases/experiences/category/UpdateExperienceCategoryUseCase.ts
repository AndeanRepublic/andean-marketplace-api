import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ExperienceCategoryRepository } from '../../../datastore/experiences/ExperienceCategory.repo';
import { CreateExperienceCategoryDto } from '../../../../infra/controllers/dto/experiences/CreateExperienceCategoryDto';
import { ExperienceCategoryResponse } from '../../../models/experiences/ExperienceCategoryResponse';
import { ExperienceCategory } from '../../../../domain/entities/experiences/ExperienceCategory';
import { ExperienceCategoryMapper } from '../../../../infra/services/experiences/ExperienceCategoryMapper';

@Injectable()
export class UpdateExperienceCategoryUseCase {
	constructor(
		@Inject(ExperienceCategoryRepository)
		private readonly categoryRepository: ExperienceCategoryRepository,
	) {}

	async handle(
		id: string,
		dto: CreateExperienceCategoryDto,
	): Promise<ExperienceCategoryResponse> {
		const existing = await this.categoryRepository.getCategoryById(id);
		if (!existing) {
			throw new NotFoundException(`ExperienceCategory with ID ${id} not found`);
		}
		const updated = new ExperienceCategory(
			existing.id,
			dto.name,
			dto.status ?? existing.status,
			existing.createdAt,
			new Date(),
		);
		const saved = await this.categoryRepository.updateCategory(updated);
		return ExperienceCategoryMapper.toResponse(saved);
	}
}
