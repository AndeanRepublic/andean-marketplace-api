import { Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodProductPresentationRepository } from '../../../datastore/superfoods/SuperfoodProductPresentation.repo';
import { SuperfoodProductPresentation } from '../../../../domain/entities/superfoods/SuperfoodProductPresentation';

@Injectable()
export class GetSuperfoodProductPresentationByIdUseCase {
	constructor(
		private readonly productPresentationRepository: SuperfoodProductPresentationRepository,
	) { }

	async handle(id: string): Promise<SuperfoodProductPresentation> {
		const productPresentation = await this.productPresentationRepository.getById(id);

		if (!productPresentation) {
			throw new NotFoundException(`SuperfoodProductPresentation with ID ${id} not found`);
		}

		return productPresentation;
	}
}
