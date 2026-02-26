import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ExperienceRepository } from '../../datastore/experiences/Experience.repo';
import { ExperienceAvailabilityMode } from 'src/andean/domain/enums/ExperienceAvailabilityMode';
import { ExperienceAvailabilityRepository } from '../../datastore/experiences/ExperienceAvailability.repo';

@Injectable()
export class GetAvailabilityModeByIdUseCase {
	constructor(
		@Inject(ExperienceRepository)
		private readonly experienceRepository: ExperienceRepository,
		@Inject(ExperienceAvailabilityRepository)
		private readonly availabilityRepository: ExperienceAvailabilityRepository,
	) {}

	async handle(experienceId: string): Promise<ExperienceAvailabilityMode> {
		const experience = await this.experienceRepository.getById(experienceId);
		if (!experience) throw new NotFoundException('Experience not found');
		const availability = await this.availabilityRepository.getById(
			experience.availabilityId,
		);
		if (!availability) throw new NotFoundException('Availability not found');
		return availability.mode ?? ExperienceAvailabilityMode.EXCLUSIVE_GROUP;
	}
}
