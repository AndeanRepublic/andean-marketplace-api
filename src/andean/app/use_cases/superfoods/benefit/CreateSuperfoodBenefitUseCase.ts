import { Injectable, BadRequestException } from '@nestjs/common';
import { SuperfoodBenefitRepository } from '../../../datastore/superfoods/SuperfoodBenefit.repo';
import { CreateSuperfoodBenefitDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodBenefitDto';
import { SuperfoodBenefitResponse } from '../../../models/superfoods/SuperfoodBenefitResponse';
import { MediaItemRepository } from '../../../datastore/MediaItem.repo';
import { SuperfoodBenefitMapper } from '../../../../infra/services/superfood/SuperfoodBenefitMapper';

@Injectable()
export class CreateSuperfoodBenefitUseCase {
	constructor(
		private readonly benefitRepository: SuperfoodBenefitRepository,
		private readonly mediaItemRepository: MediaItemRepository,
	) {}

	async handle(
		dto: CreateSuperfoodBenefitDto,
	): Promise<SuperfoodBenefitResponse> {
		const iconExists = await this.mediaItemRepository.getById(dto.iconId);
		if (!iconExists) {
			throw new BadRequestException(
				`MediaItem with id ${dto.iconId} not found`,
			);
		}

		// Crear entidad usando mapper
		const benefit = SuperfoodBenefitMapper.fromCreateDto(dto);

		const savedBenefit = await this.benefitRepository.save(benefit);
		return SuperfoodBenefitMapper.toResponse(savedBenefit);
	}
}
