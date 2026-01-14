import { Injectable } from '@nestjs/common';
import { SuperfoodProductPresentationRepository } from '../../../datastore/superfoods/SuperfoodProductPresentation.repo';
import { SuperfoodProductPresentation } from '../../../../domain/entities/superfoods/SuperfoodProductPresentation';

@Injectable()
export class ListSuperfoodProductPresentationsUseCase {
	constructor(
		private readonly productPresentationRepository: SuperfoodProductPresentationRepository,
	) { }

	async handle(): Promise<SuperfoodProductPresentation[]> {
		return await this.productPresentationRepository.getAll();
	}
}
