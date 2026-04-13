import { Injectable, NotFoundException } from '@nestjs/common';
import { BoxRepository } from '../../datastore/box/Box.repo';
import { Box } from '../../../domain/entities/box/Box';
import { CreateBoxDto } from '../../../infra/controllers/dto/box/CreateBoxDto';
import { BoxMapper } from '../../../infra/services/box/BoxMapper';
import { BoxProductLinesValidator } from '../../../infra/services/box/BoxProductLinesValidator';

@Injectable()
export class UpdateBoxUseCase {
	constructor(
		private readonly boxRepository: BoxRepository,
		private readonly boxProductLinesValidator: BoxProductLinesValidator,
	) {}

	async handle(boxId: string, dto: CreateBoxDto): Promise<Box> {
		const existing = await this.requireExistingBox(boxId);
		await this.boxProductLinesValidator.validate(dto);
		const boxToSave = BoxMapper.fromUpdateDto(boxId, dto, existing);
		return this.boxRepository.update(boxToSave);
	}

	private async requireExistingBox(boxId: string): Promise<Box> {
		const existing = await this.boxRepository.getById(boxId);
		if (!existing) {
			throw new NotFoundException(`Box with id ${boxId} not found`);
		}
		return existing;
	}
}
