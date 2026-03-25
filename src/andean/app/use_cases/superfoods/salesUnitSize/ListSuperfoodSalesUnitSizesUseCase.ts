import { Injectable } from '@nestjs/common';
import { SuperfoodSalesUnitSizeRepository } from '../../../datastore/superfoods/SuperfoodSalesUnitSize.repo';
import { SuperfoodSalesUnitSize } from '../../../../domain/entities/superfoods/SuperfoodSalesUnitSize';
import { SuperfoodSalesUnitSizeResponse } from '../../../models/superfoods/SuperfoodSalesUnitSizeResponse';
import { SuperfoodSalesUnitSizeMapper } from '../../../../infra/services/superfood/SuperfoodSalesUnitSizeMapper';

@Injectable()
export class ListSuperfoodSalesUnitSizesUseCase {
	constructor(
		private readonly salesUnitSizeRepository: SuperfoodSalesUnitSizeRepository,
	) {}

	async handle(): Promise<SuperfoodSalesUnitSizeResponse[]> {
		const sizes = await this.salesUnitSizeRepository.getAll();
		return sizes.map((size) => SuperfoodSalesUnitSizeMapper.toResponse(size));
	}
}
