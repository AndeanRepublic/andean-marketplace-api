import { Injectable } from '@nestjs/common';
import { SuperfoodBenefitRepository } from '../../../datastore/superfoods/SuperfoodBenefit.repo';
import { CreateManySuperfoodBenefitsDto } from '../../../../infra/controllers/dto/superfoods/CreateManySuperfoodBenefitsDto';
import { SuperfoodBenefitResponse } from '../../../modules/superfoods/SuperfoodBenefitResponse';
import { SuperfoodBenefitMapper } from '../../../../infra/services/superfood/SuperfoodBenefitMapper';

@Injectable()
export class CreateManySuperfoodBenefitsUseCase {
	constructor(private readonly benefitRepository: SuperfoodBenefitRepository) {}

	async handle(
		dto: CreateManySuperfoodBenefitsDto,
	): Promise<SuperfoodBenefitResponse[]> {
		const benefitsToSave = dto.superfoodBenefits.map((itemDto) =>
			SuperfoodBenefitMapper.fromCreateDto(itemDto),
		);
		const savedBenefits = await this.benefitRepository.saveMany(benefitsToSave);
		return savedBenefits.map((benefit) =>
			SuperfoodBenefitMapper.toResponse(benefit),
		);
	}
}
