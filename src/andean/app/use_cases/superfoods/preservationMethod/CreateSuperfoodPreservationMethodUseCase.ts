import { Injectable } from '@nestjs/common';
import { SuperfoodPreservationMethodRepository } from '../../../datastore/superfoods/SuperfoodPreservationMethod.repo';
import { SuperfoodPreservationMethod } from '../../../../domain/entities/superfoods/SuperfoodPreservationMethod';
import { CreateSuperfoodPreservationMethodDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodPreservationMethodDto';
import { SuperfoodPreservationMethodResponse } from '../../../modules/SuperfoodPreservationMethodResponse';
import { SuperfoodPreservationMethodMapper } from '../../../../infra/services/superfood/SuperfoodPreservationMethodMapper';

@Injectable()
export class CreateSuperfoodPreservationMethodUseCase {
	constructor(
		private readonly preservationMethodRepository: SuperfoodPreservationMethodRepository,
	) {}

	async handle(
		dto: CreateSuperfoodPreservationMethodDto,
	): Promise<SuperfoodPreservationMethodResponse> {
		// Crear entidad usando mapper
		const preservationMethod =
			SuperfoodPreservationMethodMapper.fromCreateDto(dto);

		const savedMethod =
			await this.preservationMethodRepository.save(preservationMethod);
		return SuperfoodPreservationMethodMapper.toResponse(savedMethod);
	}
}
