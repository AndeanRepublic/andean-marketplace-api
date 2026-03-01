import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SealRepository } from '../../datastore/community/Seal.repo';
import { Seal } from 'src/andean/domain/entities/community/Seal';

@Injectable()
export class GetAllSealsUseCase {
	constructor(
		@Inject(SealRepository)
		private readonly sealRepository: SealRepository,
	) {}

	async handle(): Promise<Seal[]> {
		const seals = await this.sealRepository.getAll();
		if (seals.length === 0) {
			throw new NotFoundException('No seals found');
		}
		return seals;
	}
}
