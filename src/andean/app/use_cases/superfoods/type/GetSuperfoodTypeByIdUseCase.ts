import { Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodTypeRepository } from '../../../datastore/superfoods/SuperfoodType.repo';
import { SuperfoodType } from '../../../../domain/entities/superfoods/SuperfoodType';
import { SuperfoodTypeResponse } from '../../../models/superfoods/SuperfoodTypeResponse';
import { SuperfoodTypeMapper } from '../../../../infra/services/superfood/SuperfoodTypeMapper';

@Injectable()
export class GetSuperfoodTypeByIdUseCase {
	constructor(private readonly typeRepository: SuperfoodTypeRepository) {}

	async handle(id: string): Promise<SuperfoodTypeResponse> {
		const type = await this.typeRepository.getById(id);

		if (!type) {
			throw new NotFoundException(`SuperfoodType with ID ${id} not found`);
		}

		return SuperfoodTypeMapper.toResponse(type);
	}
}
