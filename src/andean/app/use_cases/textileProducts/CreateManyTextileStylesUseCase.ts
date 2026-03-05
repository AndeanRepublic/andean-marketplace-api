import { Inject, Injectable } from '@nestjs/common';
import { TextileStyleRepository } from '../../datastore/textileProducts/TextileStyle.repo';
import { CreateManyTextileStylesDto } from 'src/andean/infra/controllers/dto/textileProducts/CreateManyTextileStylesDto';
import { TextileStyle } from 'src/andean/domain/entities/textileProducts/TextileStyle';
import { TextileStyleMapper } from 'src/andean/infra/services/textileProducts/TextileStyleMapper';

@Injectable()
export class CreateManyTextileStylesUseCase {
	constructor(
		@Inject(TextileStyleRepository)
		private readonly textileStyleRepository: TextileStyleRepository,
	) {}

	async handle(dto: CreateManyTextileStylesDto): Promise<TextileStyle[]> {
		const textileStylesToSave = dto.textileStyles.map((itemDto) =>
			TextileStyleMapper.fromCreateDto(itemDto),
		);
		return this.textileStyleRepository.createManyTextileStyles(
			textileStylesToSave,
		);
	}
}
