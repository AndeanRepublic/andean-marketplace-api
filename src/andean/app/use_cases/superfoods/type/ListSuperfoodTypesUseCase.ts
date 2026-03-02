import { Injectable } from '@nestjs/common';
import { SuperfoodTypeRepository } from '../../../datastore/superfoods/SuperfoodType.repo';
import { SuperfoodType } from '../../../../domain/entities/superfoods/SuperfoodType';
import { SuperfoodTypeResponse } from '../../../modules/SuperfoodTypeResponse';
import { SuperfoodTypeMapper } from '../../../../infra/services/superfood/SuperfoodTypeMapper';

@Injectable()
export class ListSuperfoodTypesUseCase {
	constructor(private readonly typeRepository: SuperfoodTypeRepository) {}

	async handle(): Promise<SuperfoodTypeResponse[]> {
		const types = await this.typeRepository.getAll();
		return types.map((type) => SuperfoodTypeMapper.toResponse(type));
	}
}
