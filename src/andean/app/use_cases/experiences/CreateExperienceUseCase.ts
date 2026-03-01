import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ExperienceRepository } from '../../datastore/experiences/Experience.repo';
import { Experience } from 'src/andean/domain/entities/experiences/Experience';
import { ExperienceMapper } from 'src/andean/infra/services/experiences/ExperienceMapper';
import { ExperienceBasicInfoMapper } from 'src/andean/infra/services/experiences/ExperienceBasicInfoMapper';
import { ExperienceMediaInfoMapper } from 'src/andean/infra/services/experiences/ExperienceMediaInfoMapper';
import { ExperienceDetailInfoMapper } from 'src/andean/infra/services/experiences/ExperienceDetailInfoMapper';
import { CreateExperienceDto } from 'src/andean/infra/controllers/dto/experiences/CreateExperienceDto';
import { CreateExperiencePricesUseCase } from './prices/CreateExperiencePricesUseCase';
import { CreateExperienceAvailabilityUseCase } from './availability/CreateExperienceAvailabilityUseCase';
import { CreateExperienceItineraryUseCase } from './itinerary/CreateExperienceItineraryUseCase';
import { OwnerStrategyResolver } from 'src/andean/infra/services/experiences/OwnerStrategyResolver';
import { MediaItemRepository } from '../../datastore/MediaItem.repo';

@Injectable()
export class CreateExperienceUseCase {
	constructor(
		@Inject(ExperienceRepository)
		private readonly experienceRepository: ExperienceRepository,
		@Inject(MediaItemRepository)
		private readonly mediaItemRepository: MediaItemRepository,
		private readonly ownerStrategyResolver: OwnerStrategyResolver,
		private readonly createPricesUseCase: CreateExperiencePricesUseCase,
		private readonly createAvailabilityUseCase: CreateExperienceAvailabilityUseCase,
		private readonly createItineraryUseCase: CreateExperienceItineraryUseCase,
	) { }

	async handle(dto: CreateExperienceDto): Promise<Experience> {
		// 1. Validar owner (basicInfo)
		const ownerStrategy = this.ownerStrategyResolver.resolve(dto.basicInfo.ownerType);
		await ownerStrategy.validate(dto.basicInfo.ownerId);

		// 2. Validar que todos los MediaItem IDs existen
		await this.validateMediaIds(dto);

		// 3. Construir Value Objects embebidos directamente desde los DTOs
		const basicInfo = ExperienceBasicInfoMapper.fromDto(dto.basicInfo);
		const mediaInfo = ExperienceMediaInfoMapper.fromDto(dto.mediaInfo);
		const detailInfo = ExperienceDetailInfoMapper.fromDto(dto.detailInfo);

		// 4. Crear sub-tablas separadas (prices, availability, itineraries)
		const [prices, availability] = await Promise.all([
			this.createPricesUseCase.handle(dto.prices),
			this.createAvailabilityUseCase.handle(dto.availability),
		]);

		const itineraries = await this.createItineraryUseCase.handle(dto.itineraries);

		// 5. Crear el documento principal con todo embebido
		const experienceEntity = ExperienceMapper.fromCreateDto({
			status: dto.status,
			basicInfo,
			mediaInfo,
			detailInfo,
			pricesId: prices.id,
			availabilityId: availability.id,
			itineraryIds: itineraries.map((it) => it.id),
		});

		return this.experienceRepository.save(experienceEntity);
	}

	private async validateMediaIds(dto: CreateExperienceDto): Promise<void> {
		const allIds = [
			dto.mediaInfo.landscapeImg,
			dto.mediaInfo.thumbnailImg,
			...(dto.mediaInfo.photos || []),
			...(dto.mediaInfo.videos || []),
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
