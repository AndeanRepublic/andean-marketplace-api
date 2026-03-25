import { Injectable } from '@nestjs/common';
import { SuperfoodProductPresentationRepository } from '../../../datastore/superfoods/SuperfoodProductPresentation.repo';
import { CreateManySuperfoodProductPresentationsDto } from '../../../../infra/controllers/dto/superfoods/CreateManySuperfoodProductPresentationsDto';
import { SuperfoodProductPresentationResponse } from '../../../models/superfoods/SuperfoodProductPresentationResponse';
import { SuperfoodProductPresentationMapper } from '../../../../infra/services/superfood/SuperfoodProductPresentationMapper';

@Injectable()
export class CreateManySuperfoodProductPresentationsUseCase {
	constructor(
		private readonly productPresentationRepository: SuperfoodProductPresentationRepository,
	) {}

	async handle(
		dto: CreateManySuperfoodProductPresentationsDto,
	): Promise<SuperfoodProductPresentationResponse[]> {
		const presentationsToSave = dto.superfoodProductPresentations.map(
			(itemDto) => SuperfoodProductPresentationMapper.fromCreateDto(itemDto),
		);
		const savedPresentations =
			await this.productPresentationRepository.saveMany(presentationsToSave);
		return savedPresentations.map((presentation) =>
			SuperfoodProductPresentationMapper.toResponse(presentation),
		);
	}
}
