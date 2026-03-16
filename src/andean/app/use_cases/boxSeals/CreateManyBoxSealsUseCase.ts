import { Injectable } from '@nestjs/common';
import { BoxSealRepository } from '../../datastore/box/BoxSeal.repo';
import { BoxSeal } from '../../../domain/entities/box/BoxSeal';
import { BoxSealMapper } from '../../../infra/services/box/BoxSealMapper';
import { CreateManyBoxSealsDto } from '../../../infra/controllers/dto/box/CreateManyBoxSealsDto';

@Injectable()
export class CreateManyBoxSealsUseCase {
	constructor(private readonly boxSealRepository: BoxSealRepository) {}

	async handle(dto: CreateManyBoxSealsDto): Promise<BoxSeal[]> {
		const boxSeals = dto.boxSeals.map((item) =>
			BoxSealMapper.fromCreateDto(item),
		);
		return this.boxSealRepository.saveMany(boxSeals);
	}
}
