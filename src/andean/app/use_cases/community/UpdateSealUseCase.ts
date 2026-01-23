import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SealRepository } from '../../datastore/community/Seal.repo';
import { Seal } from 'src/andean/domain/entities/community/Seal';
import { SealMapper } from 'src/andean/infra/services/community/SealMapper';
import { CreateSealDto } from 'src/andean/infra/controllers/dto/community/CreateSealDto';

@Injectable()
export class UpdateSealUseCase {
	constructor(
		@Inject(SealRepository)
		private readonly sealRepository: SealRepository,
	) {}

	async handle(id: string, dto: CreateSealDto): Promise<Seal> {
		const sealFound = await this.sealRepository.getById(id);
		if (!sealFound) {
			throw new NotFoundException('Seal not found');
		}
		const toUpdate = SealMapper.fromUpdateDto(id, dto);
		return this.sealRepository.update(id, toUpdate);
	}
}
