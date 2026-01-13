import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ICommunityRepository } from '../../datastore/community.repository.interface';
import { Community } from '../../../domain/entities/community/Community';
import { UpdateCommunityDto } from '../../../infra/controllers/dto/community/UpdateCommunityDto';

@Injectable()
export class UpdateCommunityUseCase {
	constructor(
		private readonly communityRepository: ICommunityRepository,
	) { }

	async execute(id: string, dto: UpdateCommunityDto): Promise<Community> {
		// Verificar existencia
		const existing = await this.communityRepository.findById(id);
		if (!existing) {
			throw new NotFoundException(`Community with id ${id} not found`);
		}

		// Si se intenta cambiar el nombre, validar que no exista otra comunidad con ese nombre
		if (dto.name && dto.name !== existing.name) {
			const communityWithSameName = await this.communityRepository.findByName(dto.name);
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
