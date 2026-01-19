import { Injectable } from '@nestjs/common';
import { SuperfoodBenefitRepository } from '../../../datastore/superfoods/SuperfoodBenefit.repo';
import { SuperfoodBenefit } from '../../../../domain/entities/superfoods/SuperfoodBenefit';
import { SuperfoodBenefitResponse } from '../../../modules/SuperfoodBenefitResponse';
import { SuperfoodBenefitMapper } from '../../../../infra/services/superfood/SuperfoodBenefitMapper';

@Injectable()
export class ListSuperfoodBenefitsUseCase {
	constructor(
		private readonly benefitRepository: SuperfoodBenefitRepository,
	) { }

	async handle(): Promise<SuperfoodBenefitResponse[]> {
		const benefits = await this.benefitRepository.getAll();
		return benefits.map(benefit => SuperfoodBenefitMapper.toResponse(benefit));
	}
}
