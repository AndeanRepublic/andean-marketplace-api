import { Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodBenefitRepository } from '../../../datastore/superfoods/SuperfoodBenefit.repo';

@Injectable()
export class DeleteSuperfoodBenefitUseCase {
	constructor(private readonly benefitRepository: SuperfoodBenefitRepository) {}

	async handle(id: string): Promise<void> {
		const benefit = await this.benefitRepository.getById(id);

		if (!benefit) {
			throw new NotFoundException(`SuperfoodBenefit with ID ${id} not found`);
		}

		await this.benefitRepository.delete(id);
	}
}
