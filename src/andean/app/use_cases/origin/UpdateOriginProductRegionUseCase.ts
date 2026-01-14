import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { OriginProductRegionRepository } from '../../datastore/originProductRegion.repo';
import { OriginProductRegion } from '../../../domain/entities/origin/OriginProductRegion';
import { UpdateOriginProductRegionDto } from '../../../infra/controllers/dto/origin/UpdateOriginProductRegionDto';

@Injectable()
export class UpdateOriginProductRegionUseCase {
	constructor(
		private readonly regionRepository: OriginProductRegionRepository,
	) { }

	async execute(id: string, dto: UpdateOriginProductRegionDto): Promise<OriginProductRegion> {
		// Verificar existencia
		const existing = await this.regionRepository.findById(id);
		if (!existing) {
			throw new NotFoundException(`Region with id ${id} not found`);
		}

		// Si se intenta cambiar el nombre, validar que no exista otra región con ese nombre
		if (dto.name && dto.name !== existing.name) {
			const regionWithSameName = await this.regionRepository.findByName(dto.name);
			if (regionWithSameName) {
				throw new BadRequestException(`Region with name "${dto.name}" already exists`);
			}
		}

		// Actualizar
		const updated = await this.regionRepository.update(id, dto);

		if (!updated) {
			throw new NotFoundException(`Failed to update Region`);
		}

		return updated;
	}
}
