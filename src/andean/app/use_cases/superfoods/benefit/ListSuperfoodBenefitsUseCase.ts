import { Injectable } from '@nestjs/common';
import { SuperfoodBenefitRepository } from '../../../datastore/superfoods/SuperfoodBenefit.repo';
import { SuperfoodBenefit } from '../../../../domain/entities/superfoods/SuperfoodBenefit';

@Injectable()
export class ListSuperfoodBenefitsUseCase {
	constructor(
		private readonly benefitRepository: SuperfoodBenefitRepository,
	) { }

	async handle(): Promise<SuperfoodBenefit[]> {
		return await this.benefitRepository.getAll();
	}
}
