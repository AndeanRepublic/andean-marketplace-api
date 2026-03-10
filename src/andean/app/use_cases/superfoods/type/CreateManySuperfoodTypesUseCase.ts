import { Injectable } from '@nestjs/common';
import { SuperfoodTypeRepository } from '../../../datastore/superfoods/SuperfoodType.repo';
import { CreateManySuperfoodTypesDto } from '../../../../infra/controllers/dto/superfoods/CreateManySuperfoodTypesDto';
import { SuperfoodTypeResponse } from '../../../modules/superfoods/SuperfoodTypeResponse';
import { SuperfoodTypeMapper } from '../../../../infra/services/superfood/SuperfoodTypeMapper';

@Injectable()
export class CreateManySuperfoodTypesUseCase {
	constructor(private readonly typeRepository: SuperfoodTypeRepository) {}

	async handle(
		dto: CreateManySuperfoodTypesDto,
	): Promise<SuperfoodTypeResponse[]> {
		const typesToSave = dto.superfoodTypes.map((itemDto) =>
			SuperfoodTypeMapper.fromCreateDto(itemDto),
		);
		const savedTypes = await this.typeRepository.saveMany(typesToSave);
		return savedTypes.map((type) => SuperfoodTypeMapper.toResponse(type));
	}
}
