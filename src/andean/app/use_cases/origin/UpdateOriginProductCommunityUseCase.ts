import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { OriginProductCommunityRepository } from '../../datastore/originProductCommunity.repo';
import { OriginProductRegionRepository } from '../../datastore/originProductRegion.repo';
import { OriginProductCommunity } from '../../../domain/entities/origin/OriginProductCommunity';
import { UpdateOriginProductCommunityDto } from '../../../infra/controllers/dto/origin/UpdateOriginProductCommunityDto';

@Injectable()
export class UpdateOriginProductCommunityUseCase {
	constructor(
		private readonly communityRepository: OriginProductCommunityRepository,
		private readonly regionRepository: OriginProductRegionRepository,
	) { }

	async execute(id: string, dto: UpdateOriginProductCommunityDto): Promise<OriginProductCommunity> {
		// Verificar existencia
		const existing = await this.communityRepository.getById(id);
		if (!existing) {
			throw new NotFoundException(`Community with id ${id} not found`);
		}

		// Si se intenta cambiar el regionId, validar que la región exista
		if (dto.regionId && dto.regionId !== existing.regionId) {
			const region = await this.regionRepository.getById(dto.regionId);
			if (!region) {
				throw new NotFoundException(`Region with id ${dto.regionId} not found`);
			}
		}

		// Si se intenta cambiar el nombre, validar que no exista otra comunidad con ese nombre
		if (dto.name && dto.name !== existing.name) {
			const communityWithSameName = await this.communityRepository.getByName(dto.name);
			if (communityWithSameName) {
				throw new BadRequestException(`Community with name "${dto.name}" already exists`);
			}
		}

		// Actualizar
		const updated = await this.communityRepository.update(id, dto);

		if (!updated) {
			throw new NotFoundException(`Failed to update Community`);
		}

		return updated;
	}
}
