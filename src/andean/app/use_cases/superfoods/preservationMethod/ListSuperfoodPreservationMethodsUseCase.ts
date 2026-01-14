import { Injectable } from '@nestjs/common';
import { SuperfoodPreservationMethodRepository } from '../../../datastore/superfoods/SuperfoodPreservationMethod.repo';
import { SuperfoodPreservationMethod } from '../../../../domain/entities/superfoods/SuperfoodPreservationMethod';
import { SuperfoodPreservationMethodResponse } from '../../../modules/SuperfoodPreservationMethodResponse';

@Injectable()
export class ListSuperfoodPreservationMethodsUseCase {
	constructor(
		private readonly preservationMethodRepository: SuperfoodPreservationMethodRepository,
	) { }

	async handle(): Promise<SuperfoodPreservationMethodResponse[]> {
		const methods = await this.preservationMethodRepository.getAll();
		return methods.map(method => ({
			id: method.id,
			name: method.name,
			createdAt: method.createdAt!,
			updatedAt: method.updatedAt!,
		}));
	}
}
