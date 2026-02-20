import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ExperienceMediaInfoRepository } from '../../../datastore/experiences/ExperienceMediaInfo.repo';
import { ExperienceMediaInfo } from 'src/andean/domain/entities/experiences/ExperienceMediaInfo';
import { ExperienceMediaInfoMapper } from 'src/andean/infra/services/experiences/ExperienceMediaInfoMapper';
import { ExperienceMediaInfoDto } from 'src/andean/infra/controllers/dto/experiences/CreateExperienceDto';
import { MediaItemRepository } from '../../../datastore/MediaItem.repo';

@Injectable()
export class CreateExperienceMediaInfoUseCase {
	constructor(
		@Inject(ExperienceMediaInfoRepository)
		private readonly repo: ExperienceMediaInfoRepository,
		@Inject(MediaItemRepository)
		private readonly mediaItemRepository: MediaItemRepository,
	) { }

	async handle(dto: ExperienceMediaInfoDto): Promise<ExperienceMediaInfo> {
		await this.validateMediaIds(dto);

		const entity = ExperienceMediaInfoMapper.fromCreateDto(dto);
		return this.repo.save(entity);
	}

	private async validateMediaIds(dto: ExperienceMediaInfoDto): Promise<void> {
		const allIds = [
			dto.landscapeImg,
			dto.thumbnailImg,
			...(dto.photos || []),
			...(dto.videos || []),
		];

		const uniqueIds = [...new Set(allIds)];
		const mediaItems = await this.mediaItemRepository.getByIds(uniqueIds);
		const foundIds = new Set(mediaItems.map((m) => m.id));

		for (const id of uniqueIds) {
			if (!foundIds.has(id)) {
				throw new NotFoundException(`MediaItem with id ${id} not found`);
			}
		}
	}
}
