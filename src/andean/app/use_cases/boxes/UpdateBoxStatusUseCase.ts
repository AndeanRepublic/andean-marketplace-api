import { Injectable, NotFoundException } from '@nestjs/common';
import { BoxRepository } from '../../datastore/box/Box.repo';
import { AdminEntityStatus } from '../../../domain/enums/AdminEntityStatus';

@Injectable()
export class UpdateBoxStatusUseCase {
	constructor(private readonly boxRepository: BoxRepository) {}

	async handle(id: string, status: AdminEntityStatus) {
		const updated = await this.boxRepository.updateStatus(id, status);
		if (!updated) throw new NotFoundException('Box not found');
		return updated;
	}
}
