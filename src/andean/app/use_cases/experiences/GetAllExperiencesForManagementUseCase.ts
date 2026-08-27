import { Injectable } from '@nestjs/common';
import { ExperienceFilters } from '../../datastore/experiences/Experience.repo';
import { PaginatedExperiencesResponse } from '../../models/experiences/ExperienceListItemResponse';
import { GetAllExperiencesUseCase } from './GetAllExperiencesUseCase';
import { AccountRole } from '../../../domain/enums/AccountRole';
import { SellerResourceAccessService } from '../../../infra/services/seller/SellerResourceAccessService';

@Injectable()
export class GetAllExperiencesForManagementUseCase {
	constructor(
		private readonly getAllExperiencesUseCase: GetAllExperiencesUseCase,
		private readonly sellerResourceAccess: SellerResourceAccessService,
	) {}

	async handle(
		filters: ExperienceFilters | undefined,
		requestingUserId: string,
		roles: AccountRole[],
	): Promise<PaginatedExperiencesResponse> {
		const page = filters?.page || 1;
		const perPage = filters?.perPage || 20;
		const ownerIds = await this.sellerResourceAccess.resolveManagementOwnerIds(
			requestingUserId,
			roles,
		);
		if (ownerIds && ownerIds.length === 0) {
			return {
				experiences: [],
				pagination: { total: 0, page, per_page: perPage },
			};
		}

		const scopedFilters: ExperienceFilters = {
			...filters,
			includeAllStatuses: true,
		};
		if (ownerIds) {
			delete scopedFilters.ownerId;
			scopedFilters.ownerIds = ownerIds;
		}

		return this.getAllExperiencesUseCase.handle(scopedFilters);
	}
}
