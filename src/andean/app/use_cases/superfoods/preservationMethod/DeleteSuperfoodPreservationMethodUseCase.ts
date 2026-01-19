import { Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodPreservationMethodRepository } from '../../../datastore/superfoods/SuperfoodPreservationMethod.repo';

@Injectable()
export class DeleteSuperfoodPreservationMethodUseCase {
	constructor(
		private readonly preservationMethodRepository: SuperfoodPreservationMethodRepository,
	) { }

	async handle(id: string): Promise<void> {
		const preservationMethod = await this.preservationMethodRepository.getById(id);

		if (!preservationMethod) {
			throw new NotFoundException(`SuperfoodPreservationMethod with ID ${id} not found`);
		}

		await this.preservationMethodRepository.delete(id);
	}
}
