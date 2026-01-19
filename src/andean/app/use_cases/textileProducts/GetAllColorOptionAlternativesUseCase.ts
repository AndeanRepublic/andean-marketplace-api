import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ColorOptionAlternativeRepository } from '../../datastore/textileProducts/ColorOptionAlternative.repo';
import { ColorOptionAlternative } from 'src/andean/domain/entities/textileProducts/ColorOptionAlternative';

@Injectable()
export class GetAllColorOptionAlternativesUseCase {
	constructor(
		@Inject(ColorOptionAlternativeRepository)
		private readonly colorOptionAlternativeRepository: ColorOptionAlternativeRepository,
	) {}

	async handle(): Promise<ColorOptionAlternative[]> {
		const colorOptionAlternatives =
			await this.colorOptionAlternativeRepository.getAll();
		if (colorOptionAlternatives.length === 0) {
			throw new NotFoundException('No color option alternatives found');
		}
		return colorOptionAlternatives;
	}
}
