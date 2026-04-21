import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { ExperienceRepository } from '../../../datastore/experiences/Experience.repo';
import { ExperiencePricesRepository } from '../../../datastore/experiences/ExperiencePrices.repo';
import { ExperiencePrices } from 'src/andean/domain/entities/experiences/ExperiencePrices';
import { AgeGroupCode } from 'src/andean/domain/enums/AgeGroupCode';
import { AccountRole } from 'src/andean/domain/enums/AccountRole';
import { SellerResourceAccessService } from 'src/andean/infra/services/seller/SellerResourceAccessService';

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
		private readonly sellerResourceAccess: SellerResourceAccessService,
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

		await this.sellerResourceAccess.assertSellerCanManageOwner(
			requestingUserId,
			roles,
			experience.basicInfo.ownerType,
			experience.basicInfo.ownerId,
		);

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
