import { Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodProductPresentationRepository } from '../../../datastore/superfoods/SuperfoodProductPresentation.repo';

@Injectable()
export class DeleteSuperfoodProductPresentationUseCase {
	constructor(
		private readonly productPresentationRepository: SuperfoodProductPresentationRepository,
	) {}

	async handle(id: string): Promise<void> {
		const productPresentation =
			await this.productPresentationRepository.getById(id);

		if (!productPresentation) {
			throw new NotFoundException(
				`SuperfoodProductPresentation with ID ${id} not found`,
			);
		}

		await this.productPresentationRepository.delete(id);
	}
}
