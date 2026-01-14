import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { SuperfoodTypeRepository } from '../../../datastore/superfoods/SuperfoodType.repo';
import { SuperfoodType } from '../../../../domain/entities/superfoods/SuperfoodType';
import { CreateSuperfoodTypeDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodTypeDto';

@Injectable()
export class CreateSuperfoodTypeUseCase {
	constructor(
		private readonly typeRepository: SuperfoodTypeRepository,
	) { }

	async handle(dto: CreateSuperfoodTypeDto): Promise<SuperfoodType> {
		const type = new SuperfoodType(
			crypto.randomUUID(),
			dto.name,
			new Date(),
			new Date(),
		);

		return await this.typeRepository.save(type);
	}
}
