import { Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodColorRepository } from '../../../datastore/superfoods/SuperfoodColor.repo';
import { CreateSuperfoodColorDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodColorDto';
import { SuperfoodColorResponse } from '../../../models/superfoods/SuperfoodColorResponse';
import { SuperfoodColor } from '../../../../domain/entities/superfoods/SuperfoodColor';
import { SuperfoodColorMapper } from '../../../../infra/services/superfood/SuperfoodColorMapper';

@Injectable()
export class UpdateSuperfoodColorUseCase {
	constructor(private readonly colorRepository: SuperfoodColorRepository) {}

	async handle(
		id: string,
		dto: CreateSuperfoodColorDto,
	): Promise<SuperfoodColorResponse> {
		const existing = await this.colorRepository.getById(id);
		if (!existing) {
			throw new NotFoundException(`SuperfoodColor with ID ${id} not found`);
		}

		const updated = new SuperfoodColor(
			existing.id,
			dto.name,
			dto.hexCodeColor,
			existing.createdAt,
			new Date(),
		);
		const saved = await this.colorRepository.update(updated);
		return SuperfoodColorMapper.toResponse(saved);
	}
}
