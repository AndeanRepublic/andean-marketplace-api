import { Injectable, NotFoundException } from '@nestjs/common';
import { BoxRepository } from '../../datastore/box/Box.repo';

@Injectable()
export class DeleteBoxUseCase {
	constructor(private readonly boxRepository: BoxRepository) {}

	async handle(boxId: string): Promise<void> {
		const existing = await this.boxRepository.getById(boxId);
		if (!existing) {
			throw new NotFoundException(`Box with id ${boxId} not found`);
		}
		await this.boxRepository.delete(boxId);
	}
}
