import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { SuperfoodTypeRepository } from '../../../datastore/superfoods/SuperfoodType.repo';
import { SuperfoodType } from '../../../../domain/entities/superfoods/SuperfoodType';
import { CreateSuperfoodTypeDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodTypeDto';
import { SuperfoodTypeResponse } from '../../../modules/SuperfoodTypeResponse';

@Injectable()
export class CreateSuperfoodTypeUseCase {
	constructor(
		private readonly typeRepository: SuperfoodTypeRepository,
	) { }

	async handle(dto: CreateSuperfoodTypeDto): Promise<SuperfoodTypeResponse> {
		const type = new SuperfoodType(
			crypto.randomUUID(),
			dto.name,
			new Date(),
			new Date(),
		);

		const savedType = await this.typeRepository.save(type);
		return {
			id: savedType.id,
			name: savedType.name,
			icon: dto.icon,
			createdAt: savedType.createdAt!,
			updatedAt: savedType.updatedAt!,
		};
	}
}
