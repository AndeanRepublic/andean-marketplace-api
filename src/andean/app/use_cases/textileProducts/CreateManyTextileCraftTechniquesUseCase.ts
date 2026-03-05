import { Inject, Injectable } from '@nestjs/common';
import { TextileCraftTechniqueRepository } from '../../datastore/textileProducts/TextileCraftTechnique.repo';
import { CreateManyTextileCraftTechniquesDto } from 'src/andean/infra/controllers/dto/textileProducts/CreateManyTextileCraftTechniquesDto';
import { TextileCraftTechnique } from 'src/andean/domain/entities/textileProducts/TextileCraftTechnique';
import { TextileCraftTechniqueMapper } from 'src/andean/infra/services/textileProducts/TextileCraftTechniqueMapper';

@Injectable()
export class CreateManyTextileCraftTechniquesUseCase {
	constructor(
		@Inject(TextileCraftTechniqueRepository)
		private readonly textileCraftTechniqueRepository: TextileCraftTechniqueRepository,
	) {}

	async handle(
		dto: CreateManyTextileCraftTechniquesDto,
	): Promise<TextileCraftTechnique[]> {
		const textileCraftTechniquesToSave = dto.textileCraftTechniques.map(
			(itemDto) => TextileCraftTechniqueMapper.fromCreateDto(itemDto),
		);
		return this.textileCraftTechniqueRepository.createManyTextileCraftTechniques(
			textileCraftTechniquesToSave,
		);
	}
}
