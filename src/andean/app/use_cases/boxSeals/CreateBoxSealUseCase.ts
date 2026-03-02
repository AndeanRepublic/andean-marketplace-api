import { Injectable } from '@nestjs/common';
import { BoxSealRepository } from '../../datastore/box/BoxSeal.repo';
import { BoxSeal } from '../../../domain/entities/box/BoxSeal';
import { CreateBoxSealDto } from '../../../infra/controllers/dto/box/CreateBoxSealDto';
import { BoxSealMapper } from '../../../infra/services/box/BoxSealMapper';

@Injectable()
export class CreateBoxSealUseCase {
	constructor(private readonly boxSealRepository: BoxSealRepository) { }

	async handle(dto: CreateBoxSealDto): Promise<BoxSeal> {
		const boxSealToSave = BoxSealMapper.fromCreateDto(dto);
		return this.boxSealRepository.create(boxSealToSave);
	}
}
