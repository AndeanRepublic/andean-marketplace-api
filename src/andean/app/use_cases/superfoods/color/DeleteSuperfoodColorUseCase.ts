import { Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodColorRepository } from '../../../datastore/superfoods/SuperfoodColor.repo';

@Injectable()
export class DeleteSuperfoodColorUseCase {
	constructor(private readonly colorRepository: SuperfoodColorRepository) {}

	async handle(id: string): Promise<void> {
		const color = await this.colorRepository.getById(id);
		if (!color) {
			throw new NotFoundException(`SuperfoodColor with ID ${id} not found`);
		}
		await this.colorRepository.delete(id);
	}
}
