import { Injectable } from '@nestjs/common';
import { SuperfoodColorRepository } from '../../../datastore/superfoods/SuperfoodColor.repo';
import { CreateSuperfoodColorDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodColorDto';
import { SuperfoodColorResponse } from '../../../models/superfoods/SuperfoodColorResponse';
import { SuperfoodColorMapper } from '../../../../infra/services/superfood/SuperfoodColorMapper';

@Injectable()
export class CreateSuperfoodColorUseCase {
	constructor(private readonly colorRepository: SuperfoodColorRepository) {}

	async handle(dto: CreateSuperfoodColorDto): Promise<SuperfoodColorResponse> {
		const entity = SuperfoodColorMapper.fromCreateDto(dto);
		const saved = await this.colorRepository.save(entity);
		return SuperfoodColorMapper.toResponse(saved);
	}
}
