import { Injectable } from '@nestjs/common';
import { SuperfoodProductPresentationRepository } from '../../../datastore/superfoods/SuperfoodProductPresentation.repo';
import { SuperfoodProductPresentation } from '../../../../domain/entities/superfoods/SuperfoodProductPresentation';
import { CreateSuperfoodProductPresentationDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodProductPresentationDto';
import { SuperfoodProductPresentationResponse } from '../../../modules/superfoods/SuperfoodProductPresentationResponse';
import { SuperfoodProductPresentationMapper } from '../../../../infra/services/superfood/SuperfoodProductPresentationMapper';

@Injectable()
export class CreateSuperfoodProductPresentationUseCase {
	constructor(
		private readonly productPresentationRepository: SuperfoodProductPresentationRepository,
	) {}

	async handle(
		dto: CreateSuperfoodProductPresentationDto,
	): Promise<SuperfoodProductPresentationResponse> {
		// Crear entidad usando mapper
		const productPresentation =
			SuperfoodProductPresentationMapper.fromCreateDto(dto);

		const savedPresentation =
			await this.productPresentationRepository.save(productPresentation);
		return SuperfoodProductPresentationMapper.toResponse(savedPresentation);
	}
}
