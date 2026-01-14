import { Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodProductPresentationRepository } from '../../../datastore/superfoods/SuperfoodProductPresentation.repo';
import { SuperfoodProductPresentation } from '../../../../domain/entities/superfoods/SuperfoodProductPresentation';
import { SuperfoodProductPresentationResponse } from '../../../modules/SuperfoodProductPresentationResponse';

@Injectable()
export class GetSuperfoodProductPresentationByIdUseCase {
	constructor(
		private readonly productPresentationRepository: SuperfoodProductPresentationRepository,
	) { }

	async handle(id: string): Promise<SuperfoodProductPresentationResponse> {
		const productPresentation = await this.productPresentationRepository.getById(id);

		if (!productPresentation) {
			throw new NotFoundException(`SuperfoodProductPresentation with ID ${id} not found`);
		}

		return {
			id: productPresentation.id,
			name: productPresentation.name,
			createdAt: productPresentation.createdAt!,
			updatedAt: productPresentation.updatedAt!,
		};
	}
}
