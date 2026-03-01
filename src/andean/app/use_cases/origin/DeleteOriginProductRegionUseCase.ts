import { Injectable, NotFoundException } from '@nestjs/common';
import { OriginProductRegionRepository } from '../../datastore/originProductRegion.repo';

@Injectable()
export class DeleteOriginProductRegionUseCase {
	constructor(
		private readonly regionRepository: OriginProductRegionRepository,
	) {}

	async execute(id: string): Promise<void> {
		const existing = await this.regionRepository.getById(id);

		if (!existing) {
			throw new NotFoundException(`Region with id ${id} not found`);
		}

		const deleted = await this.regionRepository.delete(id);

		if (!deleted) {
			throw new NotFoundException('Failed to delete Region');
		}
	}
}
