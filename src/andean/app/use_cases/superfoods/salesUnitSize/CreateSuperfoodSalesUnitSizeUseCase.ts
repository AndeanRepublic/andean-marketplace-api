import { Injectable } from '@nestjs/common';
import { SuperfoodSalesUnitSizeRepository } from '../../../datastore/superfoods/SuperfoodSalesUnitSize.repo';
import { CreateSuperfoodSalesUnitSizeDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodSalesUnitSizeDto';
import { SuperfoodSalesUnitSizeResponse } from '../../../modules/SuperfoodSalesUnitSizeResponse';
import { SuperfoodSalesUnitSizeMapper } from '../../../../infra/services/superfood/SuperfoodSalesUnitSizeMapper';

@Injectable()
export class CreateSuperfoodSalesUnitSizeUseCase {
	constructor(
		private readonly salesUnitSizeRepository: SuperfoodSalesUnitSizeRepository,
	) {}

	async handle(
		dto: CreateSuperfoodSalesUnitSizeDto,
	): Promise<SuperfoodSalesUnitSizeResponse> {
		// Crear entidad usando mapper
		const salesUnitSize = SuperfoodSalesUnitSizeMapper.fromCreateDto(dto);

		const savedSize = await this.salesUnitSizeRepository.save(salesUnitSize);
		return SuperfoodSalesUnitSizeMapper.toResponse(savedSize);
	}
}
