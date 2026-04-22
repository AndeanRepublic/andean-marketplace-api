import { Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodSalesUnitSizeRepository } from '../../../datastore/superfoods/SuperfoodSalesUnitSize.repo';
import { CreateSuperfoodSalesUnitSizeDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodSalesUnitSizeDto';
import { SuperfoodSalesUnitSizeResponse } from '../../../models/superfoods/SuperfoodSalesUnitSizeResponse';
import { SuperfoodSalesUnitSize } from '../../../../domain/entities/superfoods/SuperfoodSalesUnitSize';
import { SuperfoodSalesUnitSizeMapper } from '../../../../infra/services/superfood/SuperfoodSalesUnitSizeMapper';

@Injectable()
export class UpdateSuperfoodSalesUnitSizeUseCase {
	constructor(
		private readonly salesUnitSizeRepository: SuperfoodSalesUnitSizeRepository,
	) {}

	async handle(
		id: string,
		dto: CreateSuperfoodSalesUnitSizeDto,
	): Promise<SuperfoodSalesUnitSizeResponse> {
		const existing = await this.salesUnitSizeRepository.getById(id);
		if (!existing) {
			throw new NotFoundException(
				`SuperfoodSalesUnitSize with ID ${id} not found`,
			);
		}

		const updated = new SuperfoodSalesUnitSize(
			existing.id,
			dto.name,
			existing.createdAt,
			new Date(),
		);
		const saved = await this.salesUnitSizeRepository.update(updated);
		return SuperfoodSalesUnitSizeMapper.toResponse(saved);
	}
}
