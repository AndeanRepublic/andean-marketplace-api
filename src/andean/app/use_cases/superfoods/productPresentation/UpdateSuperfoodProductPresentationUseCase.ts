import { Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodProductPresentationRepository } from '../../../datastore/superfoods/SuperfoodProductPresentation.repo';
import { CreateSuperfoodProductPresentationDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodProductPresentationDto';
import { SuperfoodProductPresentationResponse } from '../../../models/superfoods/SuperfoodProductPresentationResponse';
import { SuperfoodProductPresentation } from '../../../../domain/entities/superfoods/SuperfoodProductPresentation';
import { SuperfoodProductPresentationMapper } from '../../../../infra/services/superfood/SuperfoodProductPresentationMapper';

@Injectable()
export class UpdateSuperfoodProductPresentationUseCase {
	constructor(
		private readonly productPresentationRepository: SuperfoodProductPresentationRepository,
	) {}

	async handle(
		id: string,
		dto: CreateSuperfoodProductPresentationDto,
	): Promise<SuperfoodProductPresentationResponse> {
		const existing = await this.productPresentationRepository.getById(id);
		if (!existing) {
			throw new NotFoundException(
				`SuperfoodProductPresentation with ID ${id} not found`,
			);
		}

		const updated = new SuperfoodProductPresentation(
			existing.id,
			dto.name,
			existing.createdAt,
			new Date(),
		);
		const saved = await this.productPresentationRepository.update(updated);
		return SuperfoodProductPresentationMapper.toResponse(saved);
	}
}
