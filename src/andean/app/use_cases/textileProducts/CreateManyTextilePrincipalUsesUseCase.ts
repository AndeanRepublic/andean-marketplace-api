import { Inject, Injectable } from '@nestjs/common';
import { TextilePrincipalUseRepository } from '../../datastore/textileProducts/TextilePrincipalUse.repo';
import { CreateManyTextilePrincipalUsesDto } from 'src/andean/infra/controllers/dto/textileProducts/CreateManyTextilePrincipalUsesDto';
import { TextilePrincipalUse } from 'src/andean/domain/entities/textileProducts/TextilePrincipalUse';
import { TextilePrincipalUseMapper } from 'src/andean/infra/services/textileProducts/TextilePrincipalUseMapper';

@Injectable()
export class CreateManyTextilePrincipalUsesUseCase {
	constructor(
		@Inject(TextilePrincipalUseRepository)
		private readonly textilePrincipalUseRepository: TextilePrincipalUseRepository,
	) {}

	async handle(
		dto: CreateManyTextilePrincipalUsesDto,
	): Promise<TextilePrincipalUse[]> {
		const textilePrincipalUsesToSave = dto.textilePrincipalUses.map(
			(itemDto) => TextilePrincipalUseMapper.fromCreateDto(itemDto),
		);
		return this.textilePrincipalUseRepository.createManyTextilePrincipalUses(
			textilePrincipalUsesToSave,
		);
	}
}
