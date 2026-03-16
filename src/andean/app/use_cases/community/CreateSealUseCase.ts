import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SealRepository } from '../../datastore/community/Seal.repo';
import { MediaItemRepository } from '../../datastore/MediaItem.repo';
import { CreateSealDto } from 'src/andean/infra/controllers/dto/community/CreateSealDto';
import { Seal } from 'src/andean/domain/entities/community/Seal';
import { SealMapper } from 'src/andean/infra/services/community/SealMapper';

@Injectable()
export class CreateSealUseCase {
	constructor(
		@Inject(SealRepository)
		private readonly sealRepository: SealRepository,
		@Inject(MediaItemRepository)
		private readonly mediaItemRepository: MediaItemRepository,
	) { }

	async handle(dto: CreateSealDto): Promise<Seal> {
		// Validar que el MediaItem del logo existe
		const mediaItemFound = await this.mediaItemRepository.getById(
			dto.logoMediaId,
		);
		if (!mediaItemFound) {
			throw new NotFoundException(
				`MediaItem with id ${dto.logoMediaId} not found`,
			);
		}

		const sealToSave = SealMapper.fromCreateDto(dto);
		return this.sealRepository.create(sealToSave);
	}
}
