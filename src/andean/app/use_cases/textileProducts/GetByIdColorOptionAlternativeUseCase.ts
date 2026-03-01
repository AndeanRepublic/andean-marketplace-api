import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ColorOptionAlternativeRepository } from '../../datastore/textileProducts/ColorOptionAlternative.repo';
import { ColorOptionAlternative } from 'src/andean/domain/entities/textileProducts/ColorOptionAlternative';

@Injectable()
export class GetByIdColorOptionAlternativeUseCase {
	constructor(
		@Inject(ColorOptionAlternativeRepository)
		private readonly colorOptionAlternativeRepository: ColorOptionAlternativeRepository,
	) {}

	async handle(id: string): Promise<ColorOptionAlternative> {
		const colorOptionAlternativeFound =
			await this.colorOptionAlternativeRepository.getById(id);
		if (!colorOptionAlternativeFound) {
			throw new NotFoundException('Color option alternative not found');
		}
		return colorOptionAlternativeFound;
	}
}
