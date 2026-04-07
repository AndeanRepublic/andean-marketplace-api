import { Injectable, BadRequestException } from '@nestjs/common';
import { SuperfoodBenefitRepository } from '../../../datastore/superfoods/SuperfoodBenefit.repo';
import { MediaItemRepository } from '../../../datastore/MediaItem.repo';
import { CreateManySuperfoodBenefitsDto } from '../../../../infra/controllers/dto/superfoods/CreateManySuperfoodBenefitsDto';
import { SuperfoodBenefitResponse } from '../../../models/superfoods/SuperfoodBenefitResponse';
import { SuperfoodBenefitMapper } from '../../../../infra/services/superfood/SuperfoodBenefitMapper';

@Injectable()
export class CreateManySuperfoodBenefitsUseCase {
	constructor(
		private readonly benefitRepository: SuperfoodBenefitRepository,
		private readonly mediaItemRepository: MediaItemRepository,
	) {}

	async handle(
		dto: CreateManySuperfoodBenefitsDto,
	): Promise<SuperfoodBenefitResponse[]> {
		for (const item of dto.superfoodBenefits) {
			const iconExists = await this.mediaItemRepository.getById(item.iconId);
			if (!iconExists) {
				throw new BadRequestException(
					`MediaItem with id ${item.iconId} not found`,
				);
			}
		}

		const benefitsToSave = dto.superfoodBenefits.map((itemDto) =>
			SuperfoodBenefitMapper.fromCreateDto(itemDto),
		);
		const savedBenefits = await this.benefitRepository.saveMany(benefitsToSave);
		return savedBenefits.map((benefit) =>
			SuperfoodBenefitMapper.toResponse(benefit),
		);
	}
}
