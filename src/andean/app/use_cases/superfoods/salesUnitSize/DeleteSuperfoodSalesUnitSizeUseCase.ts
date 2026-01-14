import { Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodSalesUnitSizeRepository } from '../../../datastore/superfoods/SuperfoodSalesUnitSize.repo';

@Injectable()
export class DeleteSuperfoodSalesUnitSizeUseCase {
	constructor(
		private readonly salesUnitSizeRepository: SuperfoodSalesUnitSizeRepository,
	) { }

	async handle(id: string): Promise<void> {
		const salesUnitSize = await this.salesUnitSizeRepository.getById(id);

		if (!salesUnitSize) {
			throw new NotFoundException(`SuperfoodSalesUnitSize with ID ${id} not found`);
		}

		await this.salesUnitSizeRepository.delete(id);
	}
}
