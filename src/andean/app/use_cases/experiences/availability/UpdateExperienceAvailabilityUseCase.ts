import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ExperienceAvailabilityRepository } from '../../../datastore/experiences/ExperienceAvailability.repo';
import { ExperienceAvailability } from 'src/andean/domain/entities/experiences/ExperienceAvailability';
import { ExperienceAvailabilityDto } from 'src/andean/infra/controllers/dto/experiences/CreateExperienceDto';
import { ExperienceAvailabilityMode } from 'src/andean/domain/enums/ExperienceAvailabilityMode';

@Injectable()
export class UpdateExperienceAvailabilityUseCase {
	constructor(
		@Inject(ExperienceAvailabilityRepository)
		private readonly repo: ExperienceAvailabilityRepository,
	) {}

	async handle(
		id: string,
		dto: ExperienceAvailabilityDto,
	): Promise<ExperienceAvailability> {
		const existing = await this.repo.getById(id);
		if (!existing) {
			throw new NotFoundException('ExperienceAvailability not found');
		}

		const updatedData: Partial<ExperienceAvailability> = {
			...existing,
			...dto,
			mode:
				dto.mode ?? existing.mode ?? ExperienceAvailabilityMode.EXCLUSIVE_GROUP,
			specificAvailableStartDates: (dto.specificAvailableStartDates || []).map(
				(d) => new Date(d),
			),
			excludedDates: (dto.excludedDates || []).map((d) => new Date(d)),
		};

		return this.repo.update(id, updatedData);
	}
}
