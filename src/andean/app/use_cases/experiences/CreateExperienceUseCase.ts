import { Injectable, Inject } from '@nestjs/common';
import { ExperienceRepository } from '../../datastore/experiences/Experience.repo';
import { Experience } from 'src/andean/domain/entities/experiences/Experience';
import { ExperienceMapper } from 'src/andean/infra/services/experiences/ExperienceMapper';
import { CreateExperienceDto } from 'src/andean/infra/controllers/dto/experiences/CreateExperienceDto';
import { CreateExperienceBasicInfoUseCase } from './basicInfo/CreateExperienceBasicInfoUseCase';
import { CreateExperienceMediaInfoUseCase } from './mediaInfo/CreateExperienceMediaInfoUseCase';
import { CreateExperienceDetailInfoUseCase } from './detailInfo/CreateExperienceDetailInfoUseCase';
import { CreateExperiencePricesUseCase } from './prices/CreateExperiencePricesUseCase';
import { CreateExperienceAvailabilityUseCase } from './availability/CreateExperienceAvailabilityUseCase';
import { CreateExperienceItineraryUseCase } from './itinerary/CreateExperienceItineraryUseCase';

@Injectable()
export class CreateExperienceUseCase {
	constructor(
		@Inject(ExperienceRepository)
		private readonly experienceRepository: ExperienceRepository,
		private readonly createBasicInfoUseCase: CreateExperienceBasicInfoUseCase,
		private readonly createMediaInfoUseCase: CreateExperienceMediaInfoUseCase,
		private readonly createDetailInfoUseCase: CreateExperienceDetailInfoUseCase,
		private readonly createPricesUseCase: CreateExperiencePricesUseCase,
		private readonly createAvailabilityUseCase: CreateExperienceAvailabilityUseCase,
		private readonly createItineraryUseCase: CreateExperienceItineraryUseCase,
	) { }

	async handle(dto: CreateExperienceDto): Promise<Experience> {
		// 1. Crear cada sub-tabla mediante su use case y obtener sus IDs
		const [basicInfo, mediaInfo, detailInfo, prices, availability] =
			await Promise.all([
				this.createBasicInfoUseCase.handle(dto.basicInfo),
				this.createMediaInfoUseCase.handle(dto.mediaInfo),
				this.createDetailInfoUseCase.handle(dto.detailInfo),
				this.createPricesUseCase.handle(dto.prices),
				this.createAvailabilityUseCase.handle(dto.availability),
			]);

		// 2. Crear itinerarios (múltiples documentos)
		const itineraries = await this.createItineraryUseCase.handle(
			dto.itineraries,
		);

		// 3. Crear el registro principal de Experience con todos los IDs
		const experienceEntity = ExperienceMapper.fromCreateDto({
			status: dto.status,
			basicInfoId: basicInfo.id,
			mediaInfoId: mediaInfo.id,
			detailInfoId: detailInfo.id,
			pricesId: prices.id,
			availabilityId: availability.id,
			itineraryIds: itineraries.map((it) => it.id),
		});

		return this.experienceRepository.save(experienceEntity);
	}
}
