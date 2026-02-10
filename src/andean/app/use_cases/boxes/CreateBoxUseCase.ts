import { Injectable } from '@nestjs/common';
import { BoxRepository } from '../../datastore/box/Box.repo';
import { Box } from '../../../domain/entities/box/Box';
import { CreateBoxDto } from '../../../infra/controllers/dto/box/CreateBoxDto';
import { BoxMapper } from '../../../infra/services/box/BoxMapper';

@Injectable()
export class CreateBoxUseCase {
	constructor(private readonly boxRepository: BoxRepository) { }

	async handle(dto: CreateBoxDto): Promise<Box> {
		const boxToSave = BoxMapper.fromCreateDto(dto);
		return this.boxRepository.create(boxToSave);
	}
}
