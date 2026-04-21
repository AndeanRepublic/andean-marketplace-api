import { Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodTypeRepository } from '../../../datastore/superfoods/SuperfoodType.repo';
import { CreateSuperfoodTypeDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodTypeDto';
import { SuperfoodTypeResponse } from '../../../models/superfoods/SuperfoodTypeResponse';
import { SuperfoodType } from '../../../../domain/entities/superfoods/SuperfoodType';
import { SuperfoodTypeMapper } from '../../../../infra/services/superfood/SuperfoodTypeMapper';

@Injectable()
export class UpdateSuperfoodTypeUseCase {
	constructor(private readonly typeRepository: SuperfoodTypeRepository) {}

	async handle(
		id: string,
		dto: CreateSuperfoodTypeDto,
	): Promise<SuperfoodTypeResponse> {
		const existing = await this.typeRepository.getById(id);
		if (!existing) {
			throw new NotFoundException(`SuperfoodType with ID ${id} not found`);
		}

		const updated = new SuperfoodType(
			existing.id,
			dto.name,
			existing.createdAt,
			new Date(),
		);
		const saved = await this.typeRepository.update(updated);
		return SuperfoodTypeMapper.toResponse(saved);
	}
}
