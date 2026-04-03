import { Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodColorRepository } from '../../../datastore/superfoods/SuperfoodColor.repo';
import { SuperfoodColorResponse } from '../../../models/superfoods/SuperfoodColorResponse';
import { SuperfoodColorMapper } from '../../../../infra/services/superfood/SuperfoodColorMapper';

@Injectable()
export class GetSuperfoodColorByIdUseCase {
	constructor(private readonly colorRepository: SuperfoodColorRepository) {}

	async handle(id: string): Promise<SuperfoodColorResponse> {
		const color = await this.colorRepository.getById(id);
		if (!color) {
			throw new NotFoundException(`SuperfoodColor with ID ${id} not found`);
		}
		return SuperfoodColorMapper.toResponse(color);
	}
}
