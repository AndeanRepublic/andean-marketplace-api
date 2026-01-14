import { Injectable } from '@nestjs/common';
import { SuperfoodTypeRepository } from '../../../datastore/superfoods/SuperfoodType.repo';
import { SuperfoodType } from '../../../../domain/entities/superfoods/SuperfoodType';

@Injectable()
export class ListSuperfoodTypesUseCase {
	constructor(
		private readonly typeRepository: SuperfoodTypeRepository,
	) { }

	async handle(): Promise<SuperfoodType[]> {
		return await this.typeRepository.getAll();
	}
}
