import { Inject, Injectable } from '@nestjs/common';
import { TextileStyleRepository } from '../../datastore/textileProducts/TextileStyle.repo';
import { CreateTextileStyleDto } from 'src/andean/infra/controllers/dto/textileProducts/CreateTextileStyleDto';
import { TextileStyle } from 'src/andean/domain/entities/textileProducts/TextileStyle';
import { TextileStyleMapper } from 'src/andean/infra/services/textileProducts/TextileStyleMapper';

@Injectable()
export class CreateTextileStyleUseCase {
	constructor(
		@Inject(TextileStyleRepository)
		private readonly textileStyleRepository: TextileStyleRepository,
	) {}

	async handle(dto: CreateTextileStyleDto): Promise<TextileStyle> {
		const textileStyleToSave = TextileStyleMapper.fromCreateDto(dto);
		return this.textileStyleRepository.saveTextileStyle(textileStyleToSave);
	}
}
