import { Injectable } from '@nestjs/common';
import { OriginProductRegionRepository } from '../../datastore/originProductRegion.repo';
import { CreateManyOriginProductRegionsDto } from 'src/andean/infra/controllers/dto/origin/CreateManyOriginProductRegionsDto';
import { OriginProductRegion } from 'src/andean/domain/entities/origin/OriginProductRegion';
import { OriginProductRegionMapper } from 'src/andean/infra/services/OriginProductRegionMapper';

@Injectable()
export class CreateManyOriginProductRegionsUseCase {
	constructor(
		private readonly regionRepository: OriginProductRegionRepository,
	) {}

	async execute(
		dto: CreateManyOriginProductRegionsDto,
	): Promise<OriginProductRegion[]> {
		const regionsToSave = dto.originProductRegions.map((itemDto) =>
			OriginProductRegionMapper.fromCreateDto(itemDto),
		);
		return this.regionRepository.createMany(regionsToSave);
	}
}
