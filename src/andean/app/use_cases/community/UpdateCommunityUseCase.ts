import {
	Injectable,
	NotFoundException,
	BadRequestException,
	Inject,
} from '@nestjs/common';
import { CommunityRepository } from '../../datastore/community/community.repo';
import { SealRepository } from '../../datastore/community/Seal.repo';
import { MediaItemRepository } from '../../datastore/MediaItem.repo';
import { Community } from '../../../domain/entities/community/Community';
import { UpdateCommunityDto } from '../../../infra/controllers/dto/community/UpdateCommunityDto';
import { CommunityMapper } from '../../../infra/services/community/CommunityMapper';

@Injectable()
export class UpdateCommunityUseCase {
	constructor(
		private readonly communityRepository: CommunityRepository,
		@Inject(SealRepository)
		private readonly sealRepository: SealRepository,
		@Inject(MediaItemRepository)
		private readonly mediaItemRepository: MediaItemRepository,
	) { }

	async execute(id: string, dto: UpdateCommunityDto): Promise<Community> {
		// Verificar existencia
		const existing = await this.communityRepository.getById(id);
		if (!existing) {
			throw new NotFoundException(`Community with id ${id} not found`);
		}

		// Si se intenta cambiar el nombre, validar que no exista otra comunidad con ese nombre
		if (dto.name && dto.name !== existing.name) {
			const communityWithSameName = await this.communityRepository.getByName(
				dto.name,
			);
			if (communityWithSameName) {
				throw new BadRequestException(
					`Community with name "${dto.name}" already exists`,
				);
			}
		}

		// Validar que el MediaItem del banner existe si se proporciona
		if (dto.bannerImageId) {
			const mediaItemFound = await this.mediaItemRepository.getById(
				dto.bannerImageId,
			);
			if (!mediaItemFound) {
				throw new NotFoundException(
					`MediaItem with id ${dto.bannerImageId} not found`,
				);
			}
		}

		// Validar que los seals existan si se proporcionan
		if (dto.seals && dto.seals.length > 0) {
			for (const sealId of dto.seals) {
				const sealFound = await this.sealRepository.getById(sealId);
				if (!sealFound) {
					throw new NotFoundException(`Seal with id ${sealId} not found`);
				}
			}
		}

		// Construir objeto de actualización combinando datos existentes con nuevos
		const updateData: Partial<Community> = {
			...existing,
			...dto,
		};

		// Actualizar
		const updated = await this.communityRepository.update(id, updateData);

		if (!updated) {
			throw new NotFoundException(`Failed to update Community`);
		}

		return updated;
	}
}
