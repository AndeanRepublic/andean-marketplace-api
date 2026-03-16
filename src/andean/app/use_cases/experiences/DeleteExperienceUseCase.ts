import {
	Injectable,
	Inject,
	NotFoundException,
	ForbiddenException,
} from '@nestjs/common';
import { ExperienceRepository } from '../../datastore/experiences/Experience.repo';
import { ExperiencePricesRepository } from '../../datastore/experiences/ExperiencePrices.repo';
import { ExperienceAvailabilityRepository } from '../../datastore/experiences/ExperienceAvailability.repo';
import { ExperienceItineraryRepository } from '../../datastore/experiences/ExperienceItinerary.repo';
import { ShopRepository } from '../../datastore/Shop.repo';
import { SellerProfileRepository } from '../../datastore/Seller.repo';
import { OwnerType } from 'src/andean/domain/enums/OwnerType';
import { AccountRole } from 'src/andean/domain/enums/AccountRole';

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
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
		@Inject(SellerProfileRepository)
		private readonly sellerProfileRepository: SellerProfileRepository,
	) {}

	async handle(
		id: string,
		requestingUserId: string,
		roles: AccountRole[],
	): Promise<void> {
		const experience = await this.experienceRepository.getById(id);
		if (!experience) {
			throw new NotFoundException('Experience not found');
		}

		// Ownership check
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
