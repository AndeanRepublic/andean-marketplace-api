import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { SuperfoodPreservationMethodRepository } from '../../../datastore/superfoods/SuperfoodPreservationMethod.repo';
import { SuperfoodPreservationMethod } from '../../../../domain/entities/superfoods/SuperfoodPreservationMethod';
import { CreateSuperfoodPreservationMethodDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodPreservationMethodDto';

@Injectable()
export class CreateSuperfoodPreservationMethodUseCase {
	constructor(
		private readonly preservationMethodRepository: SuperfoodPreservationMethodRepository,
	) { }

	async handle(dto: CreateSuperfoodPreservationMethodDto): Promise<SuperfoodPreservationMethod> {
		const preservationMethod = new SuperfoodPreservationMethod(
			crypto.randomUUID(),
			dto.name,
			new Date(),
			new Date(),
		);

		return await this.preservationMethodRepository.save(preservationMethod);
	}
}
