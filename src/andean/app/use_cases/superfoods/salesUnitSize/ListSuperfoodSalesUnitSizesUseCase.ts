import { Injectable } from '@nestjs/common';
import { SuperfoodSalesUnitSizeRepository } from '../../../datastore/superfoods/SuperfoodSalesUnitSize.repo';
import { SuperfoodSalesUnitSize } from '../../../../domain/entities/superfoods/SuperfoodSalesUnitSize';

@Injectable()
export class ListSuperfoodSalesUnitSizesUseCase {
	constructor(
		private readonly salesUnitSizeRepository: SuperfoodSalesUnitSizeRepository,
	) { }

	async handle(): Promise<SuperfoodSalesUnitSize[]> {
		return await this.salesUnitSizeRepository.getAll();
	}
}
