import { Injectable, BadRequestException } from '@nestjs/common';
import { OriginProductRegionRepository } from '../../datastore/originProductRegion.repo';
import { OriginProductRegion } from '../../../domain/entities/origin/OriginProductRegion';
import { CreateOriginProductRegionDto } from '../../../infra/controllers/dto/origin/CreateOriginProductRegionDto';
import { OriginProductRegionMapper } from '../../../infra/services/OriginProductRegionMapper';

@Injectable()
export class CreateOriginProductRegionUseCase {
	constructor(
		private readonly regionRepository: OriginProductRegionRepository,
	) {}

	async execute(
		dto: CreateOriginProductRegionDto,
	): Promise<OriginProductRegion> {
		// Validar que no exista una región con el mismo nombre
		const existingRegion = await this.regionRepository.getByName(dto.name);
		if (existingRegion) {
			throw new BadRequestException(
				`Region with name "${dto.name}" already exists`,
			);
		}

		// Crear entidad usando mapper
		const region = OriginProductRegionMapper.fromCreateDto(dto);

		// Persistir
		return await this.regionRepository.create(region);
	}
}
