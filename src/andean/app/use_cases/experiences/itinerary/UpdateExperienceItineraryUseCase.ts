import { Inject, Injectable } from '@nestjs/common';
import { ExperienceItineraryRepository } from '../../../datastore/experiences/ExperienceItinerary.repo';
import { ExperienceItinerary } from 'src/andean/domain/entities/experiences/ExperienceItinerary';
import { ExperienceItineraryMapper } from 'src/andean/infra/services/experiences/ExperienceItineraryMapper';
import { ExperienceItineraryDto } from 'src/andean/infra/controllers/dto/experiences/CreateExperienceDto';

@Injectable()
export class UpdateExperienceItineraryUseCase {
	constructor(
		@Inject(ExperienceItineraryRepository)
		private readonly repo: ExperienceItineraryRepository,
	) {}

	async handle(
		existingIds: string[],
		dtos: ExperienceItineraryDto[],
	): Promise<ExperienceItinerary[]> {
		// Eliminar los itinerarios existentes y crear nuevos
		if (existingIds.length > 0) {
			await this.repo.deleteMany(existingIds);
		}

		const entities = dtos.map((dto) =>
			ExperienceItineraryMapper.fromCreateDto({
				...dto,
				photos: dto.photos || [],
			}),
		);

		return this.repo.saveMany(entities);
	}
}
