import { Injectable, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import { SuperfoodBenefitRepository } from '../../../datastore/superfoods/SuperfoodBenefit.repo';
import { SuperfoodBenefit } from '../../../../domain/entities/superfoods/SuperfoodBenefit';
import { CreateSuperfoodBenefitDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodBenefitDto';
import { SuperfoodBenefitResponse } from '../../../modules/SuperfoodBenefitResponse';
import { MediaItemRepository } from '../../../datastore/MediaItem.repo';

@Injectable()
export class CreateSuperfoodBenefitUseCase {
	constructor(
		private readonly benefitRepository: SuperfoodBenefitRepository,
		private readonly mediaItemRepository: MediaItemRepository,
	) { }

	async handle(dto: CreateSuperfoodBenefitDto): Promise<SuperfoodBenefitResponse> {
		// Validar que el iconId existe si se proporciona
		if (dto.iconId) {
			const iconExists = await this.mediaItemRepository.getById(dto.iconId);
			if (!iconExists) {
				throw new BadRequestException(`MediaItem with id ${dto.iconId} not found`);
			}
		}

		const benefit = new SuperfoodBenefit(
			crypto.randomUUID(),
			dto.name,
			dto.iconId,
			new Date(),
			new Date(),
		);

		const savedBenefit = await this.benefitRepository.save(benefit);
		return {
			id: savedBenefit.id,
			name: savedBenefit.name,
			iconId: savedBenefit.iconId,
			createdAt: savedBenefit.createdAt!,
			updatedAt: savedBenefit.updatedAt!,
		};
	}
}
