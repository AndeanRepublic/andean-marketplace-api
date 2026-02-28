import { Injectable, NotFoundException } from '@nestjs/common';
import { BoxSealRepository } from '../../datastore/box/BoxSeal.repo';
import { BoxSeal } from '../../../domain/entities/box/BoxSeal';
import { UpdateBoxSealDto } from '../../../infra/controllers/dto/box/UpdateBoxSealDto';

@Injectable()
export class UpdateBoxSealUseCase {
	constructor(private readonly boxSealRepository: BoxSealRepository) {}

	async handle(id: string, dto: UpdateBoxSealDto): Promise<BoxSeal> {
		const existing = await this.boxSealRepository.getById(id);
		if (!existing) {
			throw new NotFoundException(`BoxSeal with id ${id} not found`);
		}

		const updatedData: Partial<BoxSeal> = {
			...existing,
			...dto,
		};

		return this.boxSealRepository.update(id, updatedData);
	}
}
