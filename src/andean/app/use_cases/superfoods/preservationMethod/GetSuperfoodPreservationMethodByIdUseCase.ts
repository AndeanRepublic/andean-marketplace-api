import { Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodPreservationMethodRepository } from '../../../datastore/superfoods/SuperfoodPreservationMethod.repo';
import { SuperfoodPreservationMethod } from '../../../../domain/entities/superfoods/SuperfoodPreservationMethod';

@Injectable()
export class GetSuperfoodPreservationMethodByIdUseCase {
	constructor(
		private readonly preservationMethodRepository: SuperfoodPreservationMethodRepository,
	) { }

	async handle(id: string): Promise<SuperfoodPreservationMethod> {
		const preservationMethod = await this.preservationMethodRepository.getById(id);

		if (!preservationMethod) {
			throw new NotFoundException(`SuperfoodPreservationMethod with ID ${id} not found`);
		}

		return preservationMethod;
	}
}
