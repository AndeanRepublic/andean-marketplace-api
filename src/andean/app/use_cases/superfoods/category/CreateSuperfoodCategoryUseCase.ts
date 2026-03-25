import { Injectable } from '@nestjs/common';
import { SuperfoodCategoryRepository } from '../../../datastore/superfoods/SuperfoodCategory.repo';
import { SuperfoodCategory } from '../../../../domain/entities/superfoods/SuperfoodCategory';
import { CreateSuperfoodCategoryDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodCategoryDto';
import { SuperfoodCategoryResponse } from '../../../models/superfoods/SuperfoodCategoryResponse';
import { SuperfoodCategoryMapper } from '../../../../infra/services/superfood/SuperfoodCategoryMapper';

@Injectable()
export class CreateSuperfoodCategoryUseCase {
	constructor(
		private readonly categoryRepository: SuperfoodCategoryRepository,
	) {}

	async handle(
		dto: CreateSuperfoodCategoryDto,
	): Promise<SuperfoodCategoryResponse> {
		// Crear entidad usando mapper
		const category = SuperfoodCategoryMapper.fromCreateDto(dto);

		const savedCategory = await this.categoryRepository.saveCategory(category);
		return SuperfoodCategoryMapper.toResponse(savedCategory);
	}
}
