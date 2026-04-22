import { Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodPreservationMethodRepository } from '../../../datastore/superfoods/SuperfoodPreservationMethod.repo';
import { CreateSuperfoodPreservationMethodDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodPreservationMethodDto';
import { SuperfoodPreservationMethodResponse } from '../../../models/superfoods/SuperfoodPreservationMethodResponse';
import { SuperfoodPreservationMethod } from '../../../../domain/entities/superfoods/SuperfoodPreservationMethod';
import { SuperfoodPreservationMethodMapper } from '../../../../infra/services/superfood/SuperfoodPreservationMethodMapper';

@Injectable()
export class UpdateSuperfoodPreservationMethodUseCase {
	constructor(
		private readonly preservationMethodRepository: SuperfoodPreservationMethodRepository,
	) {}

	async handle(
		id: string,
		dto: CreateSuperfoodPreservationMethodDto,
	): Promise<SuperfoodPreservationMethodResponse> {
		const existing = await this.preservationMethodRepository.getById(id);
		if (!existing) {
			throw new NotFoundException(
				`SuperfoodPreservationMethod with ID ${id} not found`,
			);
		}

		const updated = new SuperfoodPreservationMethod(
			existing.id,
			dto.name,
			existing.createdAt,
			new Date(),
		);
		const saved = await this.preservationMethodRepository.update(updated);
		return SuperfoodPreservationMethodMapper.toResponse(saved);
	}
}
