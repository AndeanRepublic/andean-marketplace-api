import { Inject, Injectable } from '@nestjs/common';
import { TextileCraftTechniqueRepository } from '../../datastore/textileProducts/TextileCraftTechnique.repo';
import { CreateTextileCraftTechniqueDto } from 'src/andean/infra/controllers/dto/textileProducts/CreateTextileCraftTechniqueDto';
import { TextileCraftTechnique } from 'src/andean/domain/entities/textileProducts/TextileCraftTechnique';
import { TextileCraftTechniqueMapper } from 'src/andean/infra/services/textileProducts/TextileCraftTechniqueMapper';

@Injectable()
export class CreateTextileCraftTechniqueUseCase {
	constructor(
		@Inject(TextileCraftTechniqueRepository)
		private readonly textileCraftTechniqueRepository: TextileCraftTechniqueRepository,
	) {}

	async handle(
		dto: CreateTextileCraftTechniqueDto,
	): Promise<TextileCraftTechnique> {
		const textileCraftTechniqueToSave =
			TextileCraftTechniqueMapper.fromCreateDto(dto);
		return this.textileCraftTechniqueRepository.saveTextileCraftTechnique(
			textileCraftTechniqueToSave,
		);
	}
}
