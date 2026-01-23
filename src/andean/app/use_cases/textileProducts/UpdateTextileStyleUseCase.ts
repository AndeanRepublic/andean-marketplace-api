import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileStyleRepository } from '../../datastore/textileProducts/TextileStyle.repo';
import { TextileStyle } from 'src/andean/domain/entities/textileProducts/TextileStyle';
import { TextileStyleMapper } from 'src/andean/infra/services/textileProducts/TextileStyleMapper';
import { CreateTextileStyleDto } from 'src/andean/infra/controllers/dto/textileProducts/CreateTextileStyleDto';

@Injectable()
export class UpdateTextileStyleUseCase {
	constructor(
		@Inject(TextileStyleRepository)
		private readonly textileStyleRepository: TextileStyleRepository,
	) {}

	async handle(id: string, dto: CreateTextileStyleDto): Promise<TextileStyle> {
		const styleFound =
			await this.textileStyleRepository.getTextileStyleById(id);
		if (!styleFound) {
			throw new NotFoundException('Style not found');
		}
		const toUpdate = TextileStyleMapper.fromUpdateDto(id, dto);
		return this.textileStyleRepository.updateTextileStyle(id, toUpdate);
	}
}
