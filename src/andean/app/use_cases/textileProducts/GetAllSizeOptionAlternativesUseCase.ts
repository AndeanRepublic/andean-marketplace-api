import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SizeOptionAlternativeRepository } from '../../datastore/textileProducts/SizeOptionAlternative.repo';
import { SizeOptionAlternative } from 'src/andean/domain/entities/textileProducts/SizeOptionAlternative';

@Injectable()
export class GetAllSizeOptionAlternativesUseCase {
	constructor(
		@Inject(SizeOptionAlternativeRepository)
		private readonly sizeOptionAlternativeRepository: SizeOptionAlternativeRepository,
	) {}

	async handle(): Promise<SizeOptionAlternative[]> {
		const sizeOptionAlternatives =
			await this.sizeOptionAlternativeRepository.getAll();
		if (sizeOptionAlternatives.length === 0) {
			throw new NotFoundException('No size option alternatives found');
		}
		return sizeOptionAlternatives;
	}
}
