import { Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodProductPresentationRepository } from '../../../datastore/superfoods/SuperfoodProductPresentation.repo';
import { SuperfoodProductPresentationResponse } from '../../../modules/SuperfoodProductPresentationResponse';
import { SuperfoodProductPresentationMapper } from '../../../../infra/services/superfood/SuperfoodProductPresentationMapper';

@Injectable()
export class GetSuperfoodProductPresentationByIdUseCase {
	constructor(
		private readonly productPresentationRepository: SuperfoodProductPresentationRepository,
	) {}

	async handle(id: string): Promise<SuperfoodProductPresentationResponse> {
		const productPresentation =
			await this.productPresentationRepository.getById(id);

		if (!productPresentation) {
			throw new NotFoundException(
				`SuperfoodProductPresentation with ID ${id} not found`,
			);
		}

		return SuperfoodProductPresentationMapper.toResponse(productPresentation);
	}
}
