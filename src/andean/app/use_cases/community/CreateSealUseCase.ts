import { Inject, Injectable } from '@nestjs/common';
import { SealRepository } from '../../datastore/community/Seal.repo';
import { CreateSealDto } from 'src/andean/infra/controllers/dto/community/CreateSealDto';
import { Seal } from 'src/andean/domain/entities/community/Seal';
import { SealMapper } from 'src/andean/infra/services/community/SealMapper';

@Injectable()
export class CreateSealUseCase {
	constructor(
		@Inject(SealRepository)
		private readonly sealRepository: SealRepository,
	) {}

	async handle(dto: CreateSealDto): Promise<Seal> {
		const sealToSave = SealMapper.fromCreateDto(dto);
		return this.sealRepository.create(sealToSave);
	}
}
