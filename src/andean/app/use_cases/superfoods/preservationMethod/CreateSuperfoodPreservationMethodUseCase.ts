import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { SuperfoodPreservationMethodRepository } from '../../../datastore/superfoods/SuperfoodPreservationMethod.repo';
import { SuperfoodPreservationMethod } from '../../../../domain/entities/superfoods/SuperfoodPreservationMethod';
import { CreateSuperfoodPreservationMethodDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodPreservationMethodDto';
import { SuperfoodPreservationMethodResponse } from '../../../modules/SuperfoodPreservationMethodResponse';

@Injectable()
export class CreateSuperfoodPreservationMethodUseCase {
	constructor(
		private readonly preservationMethodRepository: SuperfoodPreservationMethodRepository,
	) { }

	async handle(dto: CreateSuperfoodPreservationMethodDto): Promise<SuperfoodPreservationMethodResponse> {
		const preservationMethod = new SuperfoodPreservationMethod(
			crypto.randomUUID(),
			dto.name,
			new Date(),
			new Date(),
		);

		const savedMethod = await this.preservationMethodRepository.save(preservationMethod);
		return {
			id: savedMethod.id,
			name: savedMethod.name,
			icon: dto.icon,
			createdAt: savedMethod.createdAt!,
			updatedAt: savedMethod.updatedAt!,
		};
	}
}
