import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { SuperfoodSalesUnitSizeRepository } from '../../../datastore/superfoods/SuperfoodSalesUnitSize.repo';
import { SuperfoodSalesUnitSize } from '../../../../domain/entities/superfoods/SuperfoodSalesUnitSize';
import { CreateSuperfoodSalesUnitSizeDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodSalesUnitSizeDto';

@Injectable()
export class CreateSuperfoodSalesUnitSizeUseCase {
	constructor(
		private readonly salesUnitSizeRepository: SuperfoodSalesUnitSizeRepository,
	) { }

	async handle(dto: CreateSuperfoodSalesUnitSizeDto): Promise<SuperfoodSalesUnitSize> {
		const salesUnitSize = new SuperfoodSalesUnitSize(
			crypto.randomUUID(),
			dto.name,
			new Date(),
			new Date(),
		);

		return await this.salesUnitSizeRepository.save(salesUnitSize);
	}
}
