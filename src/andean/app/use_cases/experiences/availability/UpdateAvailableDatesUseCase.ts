import {
	ForbiddenException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { ExperienceRepository } from '../../../datastore/experiences/Experience.repo';
import { ExperienceAvailabilityRepository } from '../../../datastore/experiences/ExperienceAvailability.repo';
import { ExperienceAvailability } from 'src/andean/domain/entities/experiences/ExperienceAvailability';
import { SellerProfileRepository } from '../../../datastore/Seller.repo';
import { ShopRepository } from '../../../datastore/Shop.repo';
import { OwnerType } from 'src/andean/domain/enums/OwnerType';
import { AccountRole } from 'src/andean/domain/enums/AccountRole';

export interface UpdateAvailableDatesDto {
	specificAvailableStartDates: string[];
}

@Injectable()
export class UpdateAvailableDatesUseCase {
	constructor(
		@Inject(ExperienceRepository)
		private readonly experienceRepo: ExperienceRepository,
		@Inject(ExperienceAvailabilityRepository)
		private readonly availabilityRepo: ExperienceAvailabilityRepository,
		@Inject(SellerProfileRepository)
		private readonly sellerProfileRepository: SellerProfileRepository,
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
	) {}

	async handle(
		experienceId: string,
		dto: UpdateAvailableDatesDto,
		requestingUserId: string,
		roles: AccountRole[],
	): Promise<ExperienceAvailability> {
		const experience = await this.experienceRepo.getById(experienceId);
		if (!experience) {
			throw new NotFoundException(
				`Experience with id ${experienceId} not found`,
			);
		}

		// Ownership check — read from existing (DB), NEVER from dto
		const isAdmin = roles.includes(AccountRole.ADMIN);
		if (!isAdmin) {
			if (experience.basicInfo.ownerType === OwnerType.COMMUNITY) {
				throw new ForbiddenException('You can only modify your own resource');
			}
			const seller =
				await this.sellerProfileRepository.getSellerByUserId(requestingUserId);
			if (!seller)
				throw new ForbiddenException('You can only modify your own resource');
			const shops = await this.shopRepository.getAllBySellerId(seller.id);
			const shopIds = shops.map((s) => s.id);
			if (!shopIds.includes(experience.basicInfo.ownerId)) {
				throw new ForbiddenException('You can only modify your own resource');
			}
		}

		const availability = await this.availabilityRepo.getById(
			experience.availabilityId,
		);
		if (!availability) {
			throw new NotFoundException(
				`ExperienceAvailability not found for experience ${experienceId}`,
			);
		}

		const parsedDates = dto.specificAvailableStartDates.map((d) => new Date(d));

		return this.availabilityRepo.update(experience.availabilityId, {
			specificAvailableStartDates: parsedDates,
		});
	}
}
