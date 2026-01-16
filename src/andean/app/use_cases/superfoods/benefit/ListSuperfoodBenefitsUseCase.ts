import { Injectable } from '@nestjs/common';
import { SuperfoodBenefitRepository } from '../../../datastore/superfoods/SuperfoodBenefit.repo';
import { SuperfoodBenefit } from '../../../../domain/entities/superfoods/SuperfoodBenefit';
import { SuperfoodBenefitResponse } from '../../../modules/SuperfoodBenefitResponse';

@Injectable()
export class ListSuperfoodBenefitsUseCase {
	constructor(
		private readonly benefitRepository: SuperfoodBenefitRepository,
	) { }

	async handle(): Promise<SuperfoodBenefitResponse[]> {
		const benefits = await this.benefitRepository.getAll();
		return benefits.map(benefit => ({
			id: benefit.id,
			name: benefit.name,
			icon: benefit.iconId,
			createdAt: benefit.createdAt!,
			updatedAt: benefit.updatedAt!,
		}));
	}
}
