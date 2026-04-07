import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ExperienceRepository } from '../../datastore/experiences/Experience.repo';
import { ExperienceStatus } from '../../../domain/enums/ExperienceStatus';
import { AccountRole } from '../../../domain/enums/AccountRole';
import { OwnerType } from '../../../domain/enums/OwnerType';
import { ShopRepository } from '../../datastore/Shop.repo';
import { SellerProfileRepository } from '../../datastore/Seller.repo';

@Injectable()
export class UpdateExperienceStatusUseCase {
	constructor(
		@Inject(ExperienceRepository)
		private readonly experienceRepository: ExperienceRepository,
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
		@Inject(SellerProfileRepository)
		private readonly sellerProfileRepository: SellerProfileRepository,
	) {}

	async handle(
		id: string,
		status: ExperienceStatus,
		requestingUserId: string,
		roles: AccountRole[],
	) {
		const experience = await this.experienceRepository.getById(id);
		if (!experience) throw new NotFoundException('Experience not found');
		const isAdmin = roles.includes(AccountRole.ADMIN);
		if (!isAdmin) {
			if (experience.basicInfo.ownerType === OwnerType.COMMUNITY) {
				throw new ForbiddenException('You can only modify your own resource');
			}
			const seller = await this.sellerProfileRepository.getSellerByUserId(requestingUserId);
			if (!seller) throw new ForbiddenException('You can only modify your own resource');
			const shopIds = (await this.shopRepository.getAllBySellerId(seller.id)).map((s) => s.id);
			if (!shopIds.includes(experience.basicInfo.ownerId)) {
				throw new ForbiddenException('You can only modify your own resource');
			}
		}
		const updated = await this.experienceRepository.updateStatus(id, status);
		if (!updated) throw new NotFoundException('Experience not found');
		return updated;
	}
}
