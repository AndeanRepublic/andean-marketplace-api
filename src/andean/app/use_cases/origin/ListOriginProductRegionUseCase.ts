import { Injectable } from '@nestjs/common';
import { OriginProductRegionRepository } from '../../datastore/originProductRegion.repo';
import { OriginProductRegion } from '../../../domain/entities/origin/OriginProductRegion';

@Injectable()
export class ListOriginProductRegionUseCase {
	constructor(
		private readonly regionRepository: OriginProductRegionRepository,
	) { }

	async execute(): Promise<OriginProductRegion[]> {
		return await this.regionRepository.getAll();
	}
}
