import { Injectable } from '@nestjs/common';
import { BoxRepository } from '../../datastore/box/Box.repo';
import { Box } from '../../../domain/entities/box/Box';
import { CreateBoxDto } from '../../../infra/controllers/dto/box/CreateBoxDto';
import { BoxMapper } from '../../../infra/services/box/BoxMapper';
import { BoxProductLinesValidator } from '../../../infra/services/box/BoxProductLinesValidator';

@Injectable()
export class CreateBoxUseCase {
	constructor(
		private readonly boxRepository: BoxRepository,
		private readonly boxProductLinesValidator: BoxProductLinesValidator,
	) {}

	async handle(dto: CreateBoxDto): Promise<Box> {
		await this.boxProductLinesValidator.validate(dto);
		const boxToSave = BoxMapper.fromCreateDto(dto);
		return this.boxRepository.create(boxToSave);
	}
}
