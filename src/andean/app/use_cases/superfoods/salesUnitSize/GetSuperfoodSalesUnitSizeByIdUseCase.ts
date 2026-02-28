import { Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodSalesUnitSizeRepository } from '../../../datastore/superfoods/SuperfoodSalesUnitSize.repo';
import { SuperfoodSalesUnitSizeResponse } from '../../../modules/SuperfoodSalesUnitSizeResponse';
import { SuperfoodSalesUnitSizeMapper } from '../../../../infra/services/superfood/SuperfoodSalesUnitSizeMapper';

@Injectable()
export class GetSuperfoodSalesUnitSizeByIdUseCase {
	constructor(
		private readonly salesUnitSizeRepository: SuperfoodSalesUnitSizeRepository,
	) {}

	async handle(id: string): Promise<SuperfoodSalesUnitSizeResponse> {
		const salesUnitSize = await this.salesUnitSizeRepository.getById(id);

		if (!salesUnitSize) {
			throw new NotFoundException(
				`SuperfoodSalesUnitSize with ID ${id} not found`,
			);
		}

		return SuperfoodSalesUnitSizeMapper.toResponse(salesUnitSize);
	}
}
