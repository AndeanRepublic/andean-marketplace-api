import { Injectable } from '@nestjs/common';
import { SuperfoodTypeRepository } from '../../../datastore/superfoods/SuperfoodType.repo';
import { SuperfoodType } from '../../../../domain/entities/superfoods/SuperfoodType';
import { SuperfoodTypeResponse } from '../../../modules/SuperfoodTypeResponse';

@Injectable()
export class ListSuperfoodTypesUseCase {
	constructor(
		private readonly typeRepository: SuperfoodTypeRepository,
	) { }

	async handle(): Promise<SuperfoodTypeResponse[]> {
		const types = await this.typeRepository.getAll();
		return types.map(type => ({
			id: type.id,
			name: type.name,
			createdAt: type.createdAt!,
			updatedAt: type.updatedAt!,
		}));
	}
}
