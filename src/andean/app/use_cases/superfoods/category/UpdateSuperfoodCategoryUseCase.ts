import { Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodCategoryRepository } from '../../../datastore/superfoods/SuperfoodCategory.repo';
import { CreateSuperfoodCategoryDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodCategoryDto';
import { SuperfoodCategoryResponse } from '../../../models/superfoods/SuperfoodCategoryResponse';
import { SuperfoodCategory } from '../../../../domain/entities/superfoods/SuperfoodCategory';
import { SuperfoodCategoryMapper } from '../../../../infra/services/superfood/SuperfoodCategoryMapper';

@Injectable()
export class UpdateSuperfoodCategoryUseCase {
	constructor(
		private readonly categoryRepository: SuperfoodCategoryRepository,
	) {}

	async handle(
		id: string,
		dto: CreateSuperfoodCategoryDto,
	): Promise<SuperfoodCategoryResponse> {
		const existing = await this.categoryRepository.getCategoryById(id);
		if (!existing) {
			throw new NotFoundException(`SuperfoodCategory with ID ${id} not found`);
		}

		const updatedCategory = new SuperfoodCategory(
			existing.id,
			dto.name,
			dto.status || existing.status,
			existing.createdAt,
			new Date(),
		);
		const saved = await this.categoryRepository.updateCategory(updatedCategory);
		return SuperfoodCategoryMapper.toResponse(saved);
	}
}
