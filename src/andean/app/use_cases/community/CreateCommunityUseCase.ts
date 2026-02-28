import {
	Injectable,
	BadRequestException,
	Inject,
	NotFoundException,
} from '@nestjs/common';
import { CommunityRepository } from '../../datastore/community/community.repo';
import { SealRepository } from '../../datastore/community/Seal.repo';
import { MediaItemRepository } from '../../datastore/MediaItem.repo';
import { Community } from '../../../domain/entities/community/Community';
import { CreateCommunityDto } from '../../../infra/controllers/dto/community/CreateCommunityDto';
import { CommunityMapper } from '../../../infra/services/community/CommunityMapper';

@Injectable()
export class CreateCommunityUseCase {
	constructor(
		private readonly communityRepository: CommunityRepository,
		@Inject(SealRepository)
		private readonly sealRepository: SealRepository,
		@Inject(MediaItemRepository)
		private readonly mediaItemRepository: MediaItemRepository,
	) {}

	async execute(dto: CreateCommunityDto): Promise<Community> {
		// Validar que no exista una comunidad con el mismo nombre
		const existingCommunity = await this.communityRepository.getByName(
			dto.name,
		);
		if (existingCommunity) {
			throw new BadRequestException(
				`Community with name "${dto.name}" already exists`,
			);
		}

		// Validar que el MediaItem del banner existe
		const mediaItemFound = await this.mediaItemRepository.getById(
			dto.bannerImageId,
		);
		if (!mediaItemFound) {
			throw new NotFoundException(
				`MediaItem with id ${dto.bannerImageId} not found`,
			);
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

		// Crear entidad de dominio
		const community = CommunityMapper.fromCreateDto(dto);

		// Persistir
		return await this.communityRepository.create(community);
	}
}
