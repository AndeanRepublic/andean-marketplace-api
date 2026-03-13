import {
	BadRequestException,
	ForbiddenException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { ExperienceRepository } from '../../../datastore/experiences/Experience.repo';
import { ExperiencePricesRepository } from '../../../datastore/experiences/ExperiencePrices.repo';
import { ExperiencePrices } from 'src/andean/domain/entities/experiences/ExperiencePrices';
import { AgeGroupCode } from 'src/andean/domain/enums/AgeGroupCode';
import { SellerProfileRepository } from '../../../datastore/Seller.repo';
import { ShopRepository } from '../../../datastore/Shop.repo';
import { OwnerType } from 'src/andean/domain/enums/OwnerType';
import { AccountRole } from 'src/andean/domain/enums/AccountRole';

export interface UpdatePriceByAgeGroupDto {
	code: AgeGroupCode;
	price: number;
}

@Injectable()
export class UpdatePriceByAgeGroupUseCase {
	constructor(
		@Inject(ExperienceRepository)
		private readonly experienceRepo: ExperienceRepository,
		@Inject(ExperiencePricesRepository)
		private readonly pricesRepo: ExperiencePricesRepository,
		@Inject(SellerProfileRepository)
		private readonly sellerProfileRepository: SellerProfileRepository,
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
	) {}

	async handle(
		experienceId: string,
		dto: UpdatePriceByAgeGroupDto,
		requestingUserId: string,
		roles: AccountRole[],
	): Promise<ExperiencePrices> {
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

		const prices = await this.pricesRepo.getById(experience.pricesId);
		if (!prices) {
			throw new NotFoundException(
				`ExperiencePrices not found for experience ${experienceId}`,
			);
		}

		const groupIndex = prices.ageGroups.findIndex((g) => g.code === dto.code);
		if (groupIndex === -1) {
			throw new BadRequestException(
				`AgeGroup with code "${dto.code}" does not exist in this experience`,
			);
		}

		const updatedAgeGroups = prices.ageGroups.map((g) =>
			g.code === dto.code ? { ...g, price: dto.price } : g,
		);

		return this.pricesRepo.update(experience.pricesId, {
			ageGroups: updatedAgeGroups,
		});
	}
}
