import {
	ForbiddenException,
	Inject,
	Injectable,
} from '@nestjs/common';
import { BookingRepository } from '../../datastore/booking/Booking.repo';
import { SellerProfileRepository } from '../../datastore/Seller.repo';
import { ShopRepository } from '../../datastore/Shop.repo';
import { CommunityRepository } from '../../datastore/community/community.repo';
import { ExperienceRepository } from '../../datastore/experiences/Experience.repo';
import { AccountRole } from '../../../domain/enums/AccountRole';
import { BookingStatus } from '../../../domain/enums/BookingStatus';
import { Booking } from '../../../domain/entities/booking/Booking';

const FORBIDDEN = 'You can only modify your own resource';

/**
 * Alcance de experiencias para SELLER: misma regla que
 * {@link SellerResourceAccessService.assertSellerCanManageOwner} (SHOP / COMMUNITY).
 * Mantener ambos alineados si cambia la autorización de dueños.
 */
@Injectable()
export class ListBookingsForManagementUseCase {
	constructor(
		@Inject(BookingRepository)
		private readonly bookingRepository: BookingRepository,
		@Inject(SellerProfileRepository)
		private readonly sellerProfileRepository: SellerProfileRepository,
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
		@Inject(CommunityRepository)
		private readonly communityRepository: CommunityRepository,
		@Inject(ExperienceRepository)
		private readonly experienceRepository: ExperienceRepository,
	) {}

	async handle(
		userId: string,
		roles: AccountRole[],
		statuses?: BookingStatus[],
	): Promise<Booking[]> {
		let experienceIds: string[] | undefined;

		if (!roles.includes(AccountRole.ADMIN)) {
			const seller =
				await this.sellerProfileRepository.getSellerByUserId(userId);
			if (!seller) {
				throw new ForbiddenException(FORBIDDEN);
			}
			const shops = await this.shopRepository.getAllBySellerId(seller.id);
			const shopIds = shops.map((s) => s.id);
			const providerInfoIds = shops
				.map((s) => s.providerInfoId)
				.filter((id): id is string => Boolean(id));
			const communityIds =
				await this.communityRepository.findIdsByProviderInfoIdIn(
					providerInfoIds,
				);
			experienceIds =
				await this.experienceRepository.findIdsByShopOrCommunityOwners(
					shopIds,
					communityIds,
				);
		}

		return this.bookingRepository.listForManagement({
			...(experienceIds !== undefined ? { experienceIds } : {}),
			statuses:
				statuses && statuses.length > 0 ? statuses : undefined,
		});
	}
}
