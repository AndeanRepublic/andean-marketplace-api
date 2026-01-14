import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { SuperfoodSalesUnitSizeRepository } from '../../../datastore/superfoods/SuperfoodSalesUnitSize.repo';
import { SuperfoodSalesUnitSize } from '../../../../domain/entities/superfoods/SuperfoodSalesUnitSize';
import { CreateSuperfoodSalesUnitSizeDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodSalesUnitSizeDto';
import { SuperfoodSalesUnitSizeResponse } from '../../../modules/SuperfoodSalesUnitSizeResponse';

@Injectable()
export class CreateSuperfoodSalesUnitSizeUseCase {
	constructor(
		private readonly salesUnitSizeRepository: SuperfoodSalesUnitSizeRepository,
	) { }

	async handle(dto: CreateSuperfoodSalesUnitSizeDto): Promise<SuperfoodSalesUnitSizeResponse> {
		const salesUnitSize = new SuperfoodSalesUnitSize(
			crypto.randomUUID(),
			dto.name,
			new Date(),
			new Date(),
		);

		const savedSize = await this.salesUnitSizeRepository.save(salesUnitSize);
		return {
			id: savedSize.id,
			name: savedSize.name,
			icon: dto.icon,
			createdAt: savedSize.createdAt!,
			updatedAt: savedSize.updatedAt!,
		};
	}
}
