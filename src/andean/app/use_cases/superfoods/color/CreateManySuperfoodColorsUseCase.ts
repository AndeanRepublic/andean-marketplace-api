import { Injectable } from '@nestjs/common';
import { SuperfoodColorRepository } from '../../../datastore/superfoods/SuperfoodColor.repo';
import { CreateManySuperfoodColorsDto } from '../../../../infra/controllers/dto/superfoods/CreateManySuperfoodColorsDto';
import { SuperfoodColorResponse } from '../../../models/superfoods/SuperfoodColorResponse';
import { SuperfoodColorMapper } from '../../../../infra/services/superfood/SuperfoodColorMapper';

@Injectable()
export class CreateManySuperfoodColorsUseCase {
	constructor(private readonly colorRepository: SuperfoodColorRepository) {}

	async handle(
		dto: CreateManySuperfoodColorsDto,
	): Promise<SuperfoodColorResponse[]> {
		const toSave = dto.superfoodColors.map((item) =>
			SuperfoodColorMapper.fromCreateDto(item),
		);
		const saved = await this.colorRepository.saveMany(toSave);
		return saved.map((c) => SuperfoodColorMapper.toResponse(c));
	}
}
