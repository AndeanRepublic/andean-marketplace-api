import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ExperienceRepository } from '../../../datastore/experiences/Experience.repo';
import { ExperienceAvailabilityRepository } from '../../../datastore/experiences/ExperienceAvailability.repo';
import { ExperienceAvailability } from 'src/andean/domain/entities/experiences/ExperienceAvailability';
import { AccountRole } from 'src/andean/domain/enums/AccountRole';
import { SellerResourceAccessService } from 'src/andean/infra/services/seller/SellerResourceAccessService';

export interface UpdateExcludedDatesDto {
	excludedDates: string[];
}

@Injectable()
export class UpdateExcludedDatesUseCase {
	constructor(
		@Inject(ExperienceRepository)
		private readonly experienceRepo: ExperienceRepository,
		@Inject(ExperienceAvailabilityRepository)
		private readonly availabilityRepo: ExperienceAvailabilityRepository,
		private readonly sellerResourceAccess: SellerResourceAccessService,
	) {}

	async handle(
		experienceId: string,
		dto: UpdateExcludedDatesDto,
		requestingUserId: string,
		roles: AccountRole[],
	): Promise<ExperienceAvailability> {
		const experience = await this.experienceRepo.getById(experienceId);
		if (!experience) {
			throw new NotFoundException(
				`Experience with id ${experienceId} not found`,
			);
		}

		await this.sellerResourceAccess.assertSellerCanManageOwner(
			requestingUserId,
			roles,
			experience.basicInfo.ownerType,
			experience.basicInfo.ownerId,
		);

		const availability = await this.availabilityRepo.getById(
			experience.availabilityId,
		);
		if (!availability) {
			throw new NotFoundException(
				`ExperienceAvailability not found for experience ${experienceId}`,
			);
		}

		const parsedDates = dto.excludedDates.map((d) => new Date(d));

		return this.availabilityRepo.update(experience.availabilityId, {
			excludedDates: parsedDates,
		});
	}
}
