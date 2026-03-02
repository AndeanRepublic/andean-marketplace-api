import { Inject, Injectable } from '@nestjs/common';
import { ExperienceAvailabilityRepository } from '../../../datastore/experiences/ExperienceAvailability.repo';
import { ExperienceAvailability } from 'src/andean/domain/entities/experiences/ExperienceAvailability';
import { ExperienceAvailabilityMapper } from 'src/andean/infra/services/experiences/ExperienceAvailabilityMapper';
import { ExperienceAvailabilityDto } from 'src/andean/infra/controllers/dto/experiences/CreateExperienceDto';
import { ExperienceAvailabilityMode } from 'src/andean/domain/enums/ExperienceAvailabilityMode';

@Injectable()
export class CreateExperienceAvailabilityUseCase {
	constructor(
		@Inject(ExperienceAvailabilityRepository)
		private readonly repo: ExperienceAvailabilityRepository,
	) {}

	async handle(
		dto: ExperienceAvailabilityDto,
	): Promise<ExperienceAvailability> {
		const entity = ExperienceAvailabilityMapper.fromCreateDto({
			...dto,
			mode: dto.mode ?? ExperienceAvailabilityMode.EXCLUSIVE_GROUP,
			specificAvailableStartDates: (dto.specificAvailableStartDates || []).map(
				(d) => new Date(d),
			),
			excludedDates: (dto.excludedDates || []).map((d) => new Date(d)),
		});
		return this.repo.save(entity);
	}
}
