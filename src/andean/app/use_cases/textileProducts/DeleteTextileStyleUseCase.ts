import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileStyleRepository } from '../../datastore/textileProducts/TextileStyle.repo';

@Injectable()
export class DeleteTextileStyleUseCase {
	constructor(
		@Inject(TextileStyleRepository)
		private readonly textileStyleRepository: TextileStyleRepository,
	) {}

	async handle(id: string): Promise<void> {
		const styleFound =
			await this.textileStyleRepository.getTextileStyleById(id);
		if (!styleFound) {
			throw new NotFoundException('Style not found');
		}
		await this.textileStyleRepository.deleteTextileStyle(id);
		return;
	}
}
