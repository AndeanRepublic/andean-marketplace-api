import { Injectable, NotFoundException } from '@nestjs/common';
import { BoxSealRepository } from '../../datastore/box/BoxSeal.repo';
import { BoxSeal } from '../../../domain/entities/box/BoxSeal';

@Injectable()
export class GetBoxSealByIdUseCase {
	constructor(private readonly boxSealRepository: BoxSealRepository) {}

	async handle(id: string): Promise<BoxSeal> {
		const boxSeal = await this.boxSealRepository.getById(id);
		if (!boxSeal) {
			throw new NotFoundException(`BoxSeal with id ${id} not found`);
		}
		return boxSeal;
	}
}
