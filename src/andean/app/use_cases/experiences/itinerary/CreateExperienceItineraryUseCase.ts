import { Inject, Injectable } from '@nestjs/common';
import { ExperienceItineraryRepository } from '../../../datastore/experiences/ExperienceItinerary.repo';
import { ExperienceItinerary } from 'src/andean/domain/entities/experiences/ExperienceItinerary';
import { ExperienceItineraryMapper } from 'src/andean/infra/services/experiences/ExperienceItineraryMapper';
import { ExperienceItineraryDto } from 'src/andean/infra/controllers/dto/experiences/CreateExperienceDto';

@Injectable()
export class CreateExperienceItineraryUseCase {
	constructor(
		@Inject(ExperienceItineraryRepository)
		private readonly repo: ExperienceItineraryRepository,
	) {}

	async handle(dtos: ExperienceItineraryDto[]): Promise<ExperienceItinerary[]> {
		const entities = dtos.map((dto) =>
			ExperienceItineraryMapper.fromCreateDto({
				...dto,
				photos: dto.photos || [],
			}),
		);
		return this.repo.saveMany(entities);
	}
}
