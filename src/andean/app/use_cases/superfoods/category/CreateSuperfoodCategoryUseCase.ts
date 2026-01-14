import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { SuperfoodCategoryRepository } from '../../../datastore/superfoods/SuperfoodCategory.repo';
import { SuperfoodCategory } from '../../../../domain/entities/superfoods/SuperfoodCategory';
import { CreateSuperfoodCategoryDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodCategoryDto';

@Injectable()
export class CreateSuperfoodCategoryUseCase {
	constructor(
		private readonly categoryRepository: SuperfoodCategoryRepository,
	) { }

	async handle(dto: CreateSuperfoodCategoryDto): Promise<SuperfoodCategory> {
		const category = new SuperfoodCategory(
			crypto.randomUUID(),
			dto.name,
			dto.status || 'ENABLED',
			new Date(),
			new Date(),
		);

		return await this.categoryRepository.saveCategory(category);
	}
}
