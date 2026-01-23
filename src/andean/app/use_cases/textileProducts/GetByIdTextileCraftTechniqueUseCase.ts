import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileCraftTechniqueRepository } from '../../datastore/textileProducts/TextileCraftTechnique.repo';
import { TextileCraftTechnique } from 'src/andean/domain/entities/textileProducts/TextileCraftTechnique';

@Injectable()
export class GetByIdTextileCraftTechniqueUseCase {
	constructor(
		@Inject(TextileCraftTechniqueRepository)
		private readonly textileCraftTechniqueRepository: TextileCraftTechniqueRepository,
	) {}

	async handle(id: string): Promise<TextileCraftTechnique> {
		const techniqueFound =
			await this.textileCraftTechniqueRepository.getTextileCraftTechniqueById(
				id,
			);
		if (!techniqueFound) {
			throw new NotFoundException('Craft technique not found');
		}
		return techniqueFound;
	}
}
