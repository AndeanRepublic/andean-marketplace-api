import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { SuperfoodBenefitRepository } from '../../../datastore/superfoods/SuperfoodBenefit.repo';
import { SuperfoodBenefit } from '../../../../domain/entities/superfoods/SuperfoodBenefit';
import { CreateSuperfoodBenefitDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodBenefitDto';

@Injectable()
export class CreateSuperfoodBenefitUseCase {
	constructor(
		private readonly benefitRepository: SuperfoodBenefitRepository,
	) { }

	async handle(dto: CreateSuperfoodBenefitDto): Promise<SuperfoodBenefit> {
		const benefit = new SuperfoodBenefit(
			crypto.randomUUID(),
			dto.name,
			dto.icon,
			new Date(),
			new Date(),
		);

		return await this.benefitRepository.save(benefit);
	}
}
