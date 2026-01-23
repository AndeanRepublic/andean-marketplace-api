import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileStyleRepository } from '../../datastore/textileProducts/TextileStyle.repo';
import { TextileStyle } from 'src/andean/domain/entities/textileProducts/TextileStyle';

@Injectable()
export class GetByIdTextileStyleUseCase {
	constructor(
		@Inject(TextileStyleRepository)
		private readonly textileStyleRepository: TextileStyleRepository,
	) {}

	async handle(id: string): Promise<TextileStyle> {
		const styleFound =
			await this.textileStyleRepository.getTextileStyleById(id);
		if (!styleFound) {
			throw new NotFoundException('Style not found');
		}
		return styleFound;
	}
}
