import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ExperienceMediaInfoRepository } from '../../../datastore/experiences/ExperienceMediaInfo.repo';
import { ExperienceMediaInfo } from 'src/andean/domain/entities/experiences/ExperienceMediaInfo';
import { ExperienceMediaInfoDto } from 'src/andean/infra/controllers/dto/experiences/CreateExperienceDto';
import { MediaItemRepository } from '../../../datastore/MediaItem.repo';

@Injectable()
export class UpdateExperienceMediaInfoUseCase {
	constructor(
		@Inject(ExperienceMediaInfoRepository)
		private readonly repo: ExperienceMediaInfoRepository,
		@Inject(MediaItemRepository)
		private readonly mediaItemRepository: MediaItemRepository,
	) { }

	async handle(
		id: string,
		dto: ExperienceMediaInfoDto,
	): Promise<ExperienceMediaInfo> {
		const existing = await this.repo.getById(id);
		if (!existing) {
			throw new NotFoundException('ExperienceMediaInfo not found');
		}

		await this.validateMediaIds(dto);

		const updatedData: Partial<ExperienceMediaInfo> = {
			...existing,
			...dto,
		};

		return this.repo.update(id, updatedData);
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

		for (const mediaId of uniqueIds) {
			if (!foundIds.has(mediaId)) {
				throw new NotFoundException(
					`MediaItem with id ${mediaId} not found`,
				);
			}
		}
	}
}
