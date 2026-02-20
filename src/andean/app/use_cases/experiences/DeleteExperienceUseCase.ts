import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ExperienceRepository } from '../../datastore/experiences/Experience.repo';
import { ExperienceBasicInfoRepository } from '../../datastore/experiences/ExperienceBasicInfo.repo';
import { ExperienceMediaInfoRepository } from '../../datastore/experiences/ExperienceMediaInfo.repo';
import { ExperienceDetailInfoRepository } from '../../datastore/experiences/ExperienceDetailInfo.repo';
import { ExperiencePricesRepository } from '../../datastore/experiences/ExperiencePrices.repo';
import { ExperienceAvailabilityRepository } from '../../datastore/experiences/ExperienceAvailability.repo';
import { ExperienceItineraryRepository } from '../../datastore/experiences/ExperienceItinerary.repo';

@Injectable()
export class DeleteExperienceUseCase {
	constructor(
		@Inject(ExperienceRepository)
		private readonly experienceRepository: ExperienceRepository,
		@Inject(ExperienceBasicInfoRepository)
		private readonly basicInfoRepository: ExperienceBasicInfoRepository,
		@Inject(ExperienceMediaInfoRepository)
		private readonly mediaInfoRepository: ExperienceMediaInfoRepository,
		@Inject(ExperienceDetailInfoRepository)
		private readonly detailInfoRepository: ExperienceDetailInfoRepository,
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

		// Eliminar todas las sub-tablas en paralelo
		await Promise.all([
			this.basicInfoRepository.delete(experience.basicInfoId),
			this.mediaInfoRepository.delete(experience.mediaInfoId),
			this.detailInfoRepository.delete(experience.detailInfoId),
			this.pricesRepository.delete(experience.pricesId),
			this.availabilityRepository.delete(experience.availabilityId),
			experience.itineraryIds.length > 0
				? this.itineraryRepository.deleteMany(experience.itineraryIds)
				: Promise.resolve(),
		]);

		// Eliminar el registro principal
		await this.experienceRepository.delete(id);
	}
}
