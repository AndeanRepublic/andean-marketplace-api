import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ExperienceRepository } from '../../datastore/experiences/Experience.repo';
import { ExperienceStatus } from '../../../domain/enums/ExperienceStatus';
import { AccountRole } from '../../../domain/enums/AccountRole';
import { SellerResourceAccessService } from 'src/andean/infra/services/seller/SellerResourceAccessService';

@Injectable()
export class UpdateExperienceStatusUseCase {
	constructor(
		@Inject(ExperienceRepository)
		private readonly experienceRepository: ExperienceRepository,
		private readonly sellerResourceAccess: SellerResourceAccessService,
	) {}

	async handle(
		id: string,
		status: ExperienceStatus,
		requestingUserId: string,
		roles: AccountRole[],
	) {
		const experience = await this.experienceRepository.getById(id);
		if (!experience) throw new NotFoundException('Experience not found');
		await this.sellerResourceAccess.assertSellerCanManageOwner(
			requestingUserId,
			roles,
			experience.basicInfo.ownerType,
			experience.basicInfo.ownerId,
		);
		const updated = await this.experienceRepository.updateStatus(id, status);
		if (!updated) throw new NotFoundException('Experience not found');
		return updated;
	}
}
