import { Injectable, NotFoundException } from '@nestjs/common';
import { OriginProductRegionRepository } from '../../datastore/originProductRegion.repo';
import { OriginProductRegion } from '../../../domain/entities/origin/OriginProductRegion';

@Injectable()
export class GetOriginProductRegionByIdUseCase {
	constructor(
		private readonly regionRepository: OriginProductRegionRepository,
	) { }

	async execute(id: string): Promise<OriginProductRegion> {
		const region = await this.regionRepository.getById(id);

		if (!region) {
			throw new NotFoundException(`Region with id ${id} not found`);
		}

		return region;
	}
}
