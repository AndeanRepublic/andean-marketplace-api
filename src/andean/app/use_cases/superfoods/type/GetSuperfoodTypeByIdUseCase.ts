import { Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodTypeRepository } from '../../../datastore/superfoods/SuperfoodType.repo';
import { SuperfoodType } from '../../../../domain/entities/superfoods/SuperfoodType';
import { SuperfoodTypeResponse } from '../../../modules/SuperfoodTypeResponse';

@Injectable()
export class GetSuperfoodTypeByIdUseCase {
	constructor(
		private readonly typeRepository: SuperfoodTypeRepository,
	) { }

	async handle(id: string): Promise<SuperfoodTypeResponse> {
		const type = await this.typeRepository.getById(id);

		if (!type) {
			throw new NotFoundException(`SuperfoodType with ID ${id} not found`);
		}

		return {
			id: type.id,
			name: type.name,
			createdAt: type.createdAt!,
			updatedAt: type.updatedAt!,
		};
	}
}
