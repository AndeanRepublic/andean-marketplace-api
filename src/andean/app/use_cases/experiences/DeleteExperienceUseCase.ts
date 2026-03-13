import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ExperienceRepository } from '../../datastore/experiences/Experience.repo';
import { ExperiencePricesRepository } from '../../datastore/experiences/ExperiencePrices.repo';
import { ExperienceAvailabilityRepository } from '../../datastore/experiences/ExperienceAvailability.repo';
import { ExperienceItineraryRepository } from '../../datastore/experiences/ExperienceItinerary.repo';

@Injectable()
export class DeleteExperienceUseCase {
	constructor(
		@Inject(ExperienceRepository)
		private readonly experienceRepository: ExperienceRepository,
		@Inject(ExperiencePricesRepository)
		private readonly pricesRepository: ExperiencePricesRepository,
		@Inject(ExperienceAvailabilityRepository)
		private readonly availabilityRepository: ExperienceAvailabilityRepository,
		@Inject(ExperienceItineraryRepository)
		private readonly itineraryRepository: ExperienceItineraryRepository,
	) { }

	async handle(id: string): Promise<void> {
		const experience = await this.experienceRepository.getById(id);
		if (!experience) {
			throw new NotFoundException('Experience not found');
		}

		// basicInfo, mediaInfo y detailInfo se eliminan automáticamente al borrar el documento padre
		await Promise.all([
			this.pricesRepository.delete(experience.pricesId),
			this.availabilityRepository.delete(experience.availabilityId),
			experience.itineraryIds.length > 0
				? this.itineraryRepository.deleteMany(experience.itineraryIds)
				: Promise.resolve(),
		]);

		await this.experienceRepository.delete(id);
	}
}
