import { Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodBenefitRepository } from '../../../datastore/superfoods/SuperfoodBenefit.repo';
import { CreateSuperfoodBenefitDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodBenefitDto';
import { SuperfoodBenefitResponse } from '../../../models/superfoods/SuperfoodBenefitResponse';
import { SuperfoodBenefit } from '../../../../domain/entities/superfoods/SuperfoodBenefit';
import { SuperfoodBenefitMapper } from '../../../../infra/services/superfood/SuperfoodBenefitMapper';

@Injectable()
export class UpdateSuperfoodBenefitUseCase {
	constructor(private readonly benefitRepository: SuperfoodBenefitRepository) {}

	async handle(
		id: string,
		dto: CreateSuperfoodBenefitDto,
	): Promise<SuperfoodBenefitResponse> {
		const existing = await this.benefitRepository.getById(id);
		if (!existing) {
			throw new NotFoundException(`SuperfoodBenefit with ID ${id} not found`);
		}

		const updated = new SuperfoodBenefit(
			existing.id,
			dto.name,
			dto.description,
			dto.hexCodeColor,
			dto.iconId,
			existing.createdAt,
			new Date(),
		);
		const saved = await this.benefitRepository.update(updated);
		return SuperfoodBenefitMapper.toResponse(saved);
	}
}
