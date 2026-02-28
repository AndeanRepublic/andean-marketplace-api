import { Injectable } from '@nestjs/common';
import { SuperfoodTypeRepository } from '../../../datastore/superfoods/SuperfoodType.repo';
import { CreateSuperfoodTypeDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodTypeDto';
import { SuperfoodTypeResponse } from '../../../modules/SuperfoodTypeResponse';
import { SuperfoodTypeMapper } from '../../../../infra/services/superfood/SuperfoodTypeMapper';

@Injectable()
export class CreateSuperfoodTypeUseCase {
	constructor(private readonly typeRepository: SuperfoodTypeRepository) {}

	async handle(dto: CreateSuperfoodTypeDto): Promise<SuperfoodTypeResponse> {
		// Crear entidad usando mapper
		const type = SuperfoodTypeMapper.fromCreateDto(dto);

		const savedType = await this.typeRepository.save(type);
		return SuperfoodTypeMapper.toResponse(savedType);
	}
}
