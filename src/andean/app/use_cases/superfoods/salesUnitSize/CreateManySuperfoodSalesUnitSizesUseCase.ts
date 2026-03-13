import { Injectable } from '@nestjs/common';
import { SuperfoodSalesUnitSizeRepository } from '../../../datastore/superfoods/SuperfoodSalesUnitSize.repo';
import { CreateManySuperfoodSalesUnitSizesDto } from '../../../../infra/controllers/dto/superfoods/CreateManySuperfoodSalesUnitSizesDto';
import { SuperfoodSalesUnitSizeResponse } from '../../../modules/superfoods/SuperfoodSalesUnitSizeResponse';
import { SuperfoodSalesUnitSizeMapper } from '../../../../infra/services/superfood/SuperfoodSalesUnitSizeMapper';

@Injectable()
export class CreateManySuperfoodSalesUnitSizesUseCase {
	constructor(
		private readonly salesUnitSizeRepository: SuperfoodSalesUnitSizeRepository,
	) {}

	async handle(
		dto: CreateManySuperfoodSalesUnitSizesDto,
	): Promise<SuperfoodSalesUnitSizeResponse[]> {
		const unitSizesToSave = dto.superfoodSalesUnitSizes.map((itemDto) =>
			SuperfoodSalesUnitSizeMapper.fromCreateDto(itemDto),
		);
		const savedUnitSizes =
			await this.salesUnitSizeRepository.saveMany(unitSizesToSave);
		return savedUnitSizes.map((unitSize) =>
			SuperfoodSalesUnitSizeMapper.toResponse(unitSize),
		);
	}
}
