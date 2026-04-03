import { Injectable } from '@nestjs/common';
import { SuperfoodColorRepository } from '../../../datastore/superfoods/SuperfoodColor.repo';
import { SuperfoodColorResponse } from '../../../models/superfoods/SuperfoodColorResponse';
import { SuperfoodColorMapper } from '../../../../infra/services/superfood/SuperfoodColorMapper';

@Injectable()
export class ListSuperfoodColorsUseCase {
	constructor(private readonly colorRepository: SuperfoodColorRepository) {}

	async handle(): Promise<SuperfoodColorResponse[]> {
		const colors = await this.colorRepository.getAll();
		return colors.map((c) => SuperfoodColorMapper.toResponse(c));
	}
}
