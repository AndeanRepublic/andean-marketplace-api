import { Injectable } from '@nestjs/common';
import { SuperfoodProductPresentationRepository } from '../../../datastore/superfoods/SuperfoodProductPresentation.repo';
import { SuperfoodProductPresentation } from '../../../../domain/entities/superfoods/SuperfoodProductPresentation';
import { SuperfoodProductPresentationResponse } from '../../../modules/SuperfoodProductPresentationResponse';

@Injectable()
export class ListSuperfoodProductPresentationsUseCase {
	constructor(
		private readonly productPresentationRepository: SuperfoodProductPresentationRepository,
	) { }

	async handle(): Promise<SuperfoodProductPresentationResponse[]> {
		const presentations = await this.productPresentationRepository.getAll();
		return presentations.map(presentation => ({
			id: presentation.id,
			name: presentation.name,
			createdAt: presentation.createdAt!,
			updatedAt: presentation.updatedAt!,
		}));
	}
}
