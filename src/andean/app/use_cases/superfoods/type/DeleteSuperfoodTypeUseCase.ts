import { Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodTypeRepository } from '../../../datastore/superfoods/SuperfoodType.repo';

@Injectable()
export class DeleteSuperfoodTypeUseCase {
	constructor(private readonly typeRepository: SuperfoodTypeRepository) {}

	async handle(id: string): Promise<void> {
		const type = await this.typeRepository.getById(id);

		if (!type) {
			throw new NotFoundException(`SuperfoodType with ID ${id} not found`);
		}

		await this.typeRepository.delete(id);
	}
}
