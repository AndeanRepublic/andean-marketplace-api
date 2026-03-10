import { Injectable } from '@nestjs/common';
import { SuperfoodPreservationMethodRepository } from '../../../datastore/superfoods/SuperfoodPreservationMethod.repo';
import { CreateManySuperfoodPreservationMethodsDto } from '../../../../infra/controllers/dto/superfoods/CreateManySuperfoodPreservationMethodsDto';
import { SuperfoodPreservationMethodResponse } from '../../../modules/superfoods/SuperfoodPreservationMethodResponse';
import { SuperfoodPreservationMethodMapper } from '../../../../infra/services/superfood/SuperfoodPreservationMethodMapper';

@Injectable()
export class CreateManySuperfoodPreservationMethodsUseCase {
	constructor(
		private readonly preservationMethodRepository: SuperfoodPreservationMethodRepository,
	) {}

	async handle(
		dto: CreateManySuperfoodPreservationMethodsDto,
	): Promise<SuperfoodPreservationMethodResponse[]> {
		const methodsToSave = dto.superfoodPreservationMethods.map((itemDto) =>
			SuperfoodPreservationMethodMapper.fromCreateDto(itemDto),
		);
		const savedMethods =
			await this.preservationMethodRepository.saveMany(methodsToSave);
		return savedMethods.map((method) =>
			SuperfoodPreservationMethodMapper.toResponse(method),
		);
	}
}
