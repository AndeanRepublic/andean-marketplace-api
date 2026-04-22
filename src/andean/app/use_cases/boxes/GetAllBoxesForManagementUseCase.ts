import { Injectable } from '@nestjs/common';
import { BoxRepository } from '../../datastore/box/Box.repo';
import { BoxManagementListPaginatedResponse } from '../../models/box/BoxManagementListResponse';
import { BoxProductResolutionService } from '../../../infra/services/box/BoxProductResolutionService';
import { computeBoxListMetrics } from '../../../infra/services/box/boxListMetrics';

@Injectable()
export class GetAllBoxesForManagementUseCase {
	constructor(
		private readonly boxRepository: BoxRepository,
		private readonly boxResolutionService: BoxProductResolutionService,
	) {}

	async handle(
		page: number = 1,
		perPage: number = 10,
	): Promise<BoxManagementListPaginatedResponse> {
		const { data: boxes, total } = await this.boxRepository.getAll(page, perPage);

		if (boxes.length === 0) {
			return {
				data: [],
				pagination: { total, page, per_page: perPage },
			};
		}

		const dependencies =
			await this.boxResolutionService.bulkFetchBoxDependenciesForList(boxes);

		const data = boxes.map((box) => {
			const metrics = computeBoxListMetrics(box, dependencies.variantMap);
			return {
				id: box.id,
				name: box.name,
				slogan: box.slogan,
				price: box.price,
				itemCount: {
					textiles: metrics.textileCount,
					superfoods: metrics.superfoodCount,
				},
				fulfillableQuantity: metrics.fulfillableQuantity,
			};
		});

		return {
			data,
			pagination: { total, page, per_page: perPage },
		};
	}
}
