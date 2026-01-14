import { Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodSalesUnitSizeRepository } from '../../../datastore/superfoods/SuperfoodSalesUnitSize.repo';
import { SuperfoodSalesUnitSize } from '../../../../domain/entities/superfoods/SuperfoodSalesUnitSize';
import { SuperfoodSalesUnitSizeResponse } from '../../../modules/SuperfoodSalesUnitSizeResponse';

@Injectable()
export class GetSuperfoodSalesUnitSizeByIdUseCase {
	constructor(
		private readonly salesUnitSizeRepository: SuperfoodSalesUnitSizeRepository,
	) { }

	async handle(id: string): Promise<SuperfoodSalesUnitSizeResponse> {
		const salesUnitSize = await this.salesUnitSizeRepository.getById(id);

		if (!salesUnitSize) {
			throw new NotFoundException(`SuperfoodSalesUnitSize with ID ${id} not found`);
		}

		return {
			id: salesUnitSize.id,
			name: salesUnitSize.name,
			createdAt: salesUnitSize.createdAt!,
			updatedAt: salesUnitSize.updatedAt!,
		};
	}
}
