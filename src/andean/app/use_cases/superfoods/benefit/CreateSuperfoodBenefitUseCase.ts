import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { SuperfoodBenefitRepository } from '../../../datastore/superfoods/SuperfoodBenefit.repo';
import { SuperfoodBenefit } from '../../../../domain/entities/superfoods/SuperfoodBenefit';
import { CreateSuperfoodBenefitDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodBenefitDto';
import { SuperfoodBenefitResponse } from '../../../modules/SuperfoodBenefitResponse';

@Injectable()
export class CreateSuperfoodBenefitUseCase {
	constructor(
		private readonly benefitRepository: SuperfoodBenefitRepository,
	) { }

	async handle(dto: CreateSuperfoodBenefitDto): Promise<SuperfoodBenefitResponse> {
		const benefit = new SuperfoodBenefit(
			crypto.randomUUID(),
			dto.name,
			dto.icon,
			new Date(),
			new Date(),
		);

		const savedBenefit = await this.benefitRepository.save(benefit);
		return {
			id: savedBenefit.id,
			name: savedBenefit.name,
			icon: savedBenefit.icon,
			createdAt: savedBenefit.createdAt!,
			updatedAt: savedBenefit.updatedAt!,
		};
	}
}
