import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { SuperfoodCategoryRepository } from '../../../datastore/superfoods/SuperfoodCategory.repo';
import { SuperfoodCategory } from '../../../../domain/entities/superfoods/SuperfoodCategory';
import { CreateSuperfoodCategoryDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodCategoryDto';
import { SuperfoodCategoryResponse } from '../../../modules/SuperfoodCategoryResponse';

@Injectable()
export class CreateSuperfoodCategoryUseCase {
	constructor(
		private readonly categoryRepository: SuperfoodCategoryRepository,
	) { }

	async handle(dto: CreateSuperfoodCategoryDto): Promise<SuperfoodCategoryResponse> {
		const category = new SuperfoodCategory(
			crypto.randomUUID(),
			dto.name,
			dto.status || 'ENABLED',
			new Date(),
			new Date(),
		);

		const savedCategory = await this.categoryRepository.saveCategory(category);
		return {
			id: savedCategory.id,
			name: savedCategory.name,
			status: savedCategory.status,
			createdAt: savedCategory.createdAt!,
			updatedAt: savedCategory.updatedAt!,
		};
	}
}
