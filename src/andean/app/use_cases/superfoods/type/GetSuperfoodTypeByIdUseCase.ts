import { Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodTypeRepository } from '../../../datastore/superfoods/SuperfoodType.repo';
import { SuperfoodType } from '../../../../domain/entities/superfoods/SuperfoodType';

@Injectable()
export class GetSuperfoodTypeByIdUseCase {
	constructor(
		private readonly typeRepository: SuperfoodTypeRepository,
	) { }

	async handle(id: string): Promise<SuperfoodType> {
		const type = await this.typeRepository.getById(id);

		if (!type) {
			throw new NotFoundException(`SuperfoodType with ID ${id} not found`);
		}

		return type;
	}
}
