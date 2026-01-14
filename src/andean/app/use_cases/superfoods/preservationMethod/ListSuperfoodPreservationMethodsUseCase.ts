import { Injectable } from '@nestjs/common';
import { SuperfoodPreservationMethodRepository } from '../../../datastore/superfoods/SuperfoodPreservationMethod.repo';
import { SuperfoodPreservationMethod } from '../../../../domain/entities/superfoods/SuperfoodPreservationMethod';

@Injectable()
export class ListSuperfoodPreservationMethodsUseCase {
	constructor(
		private readonly preservationMethodRepository: SuperfoodPreservationMethodRepository,
	) { }

	async handle(): Promise<SuperfoodPreservationMethod[]> {
		return await this.preservationMethodRepository.getAll();
	}
}
