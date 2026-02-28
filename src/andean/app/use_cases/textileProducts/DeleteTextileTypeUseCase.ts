import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileTypeRepository } from '../../datastore/textileProducts/TextileType.repo';

@Injectable()
export class DeleteTextileTypeUseCase {
	constructor(
		@Inject(TextileTypeRepository)
		private readonly textileTypeRepository: TextileTypeRepository,
	) {}

	async handle(id: string): Promise<void> {
		const typeFound = await this.textileTypeRepository.getTextileTypeById(id);
		if (!typeFound) {
			throw new NotFoundException('Type not found');
		}
		await this.textileTypeRepository.deleteTextileType(id);
		return;
	}
}
