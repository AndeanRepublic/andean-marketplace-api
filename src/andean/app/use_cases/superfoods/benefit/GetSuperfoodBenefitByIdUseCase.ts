import { Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodBenefitRepository } from '../../../datastore/superfoods/SuperfoodBenefit.repo';
import { SuperfoodBenefit } from '../../../../domain/entities/superfoods/SuperfoodBenefit';
import { SuperfoodBenefitResponse } from '../../../modules/SuperfoodBenefitResponse';
import { SuperfoodBenefitMapper } from '../../../../infra/services/superfood/SuperfoodBenefitMapper';

@Injectable()
export class GetSuperfoodBenefitByIdUseCase {
	constructor(
		private readonly benefitRepository: SuperfoodBenefitRepository,
	) { }

	async handle(id: string): Promise<SuperfoodBenefitResponse> {
		const benefit = await this.benefitRepository.getById(id);

		if (!benefit) {
			throw new NotFoundException(`SuperfoodBenefit with ID ${id} not found`);
		}

		return SuperfoodBenefitMapper.toResponse(benefit);
	}
}
