import { Injectable, NotFoundException } from '@nestjs/common';
import { BoxRepository } from '../../datastore/box/Box.repo';
import { Box } from '../../../domain/entities/box/Box';

@Injectable()
export class GetBoxForAdminEditUseCase {
	constructor(private readonly boxRepository: BoxRepository) {}

	async handle(boxId: string): Promise<Box> {
		const box = await this.boxRepository.getById(boxId);
		if (!box) {
			throw new NotFoundException(`Box with id ${boxId} not found`);
		}
		return box;
	}
}
