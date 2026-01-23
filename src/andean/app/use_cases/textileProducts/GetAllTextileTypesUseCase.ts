import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileTypeRepository } from '../../datastore/textileProducts/TextileType.repo';
import { TextileType } from 'src/andean/domain/entities/textileProducts/TextileType';

@Injectable()
export class GetAllTextileTypesUseCase {
	constructor(
		@Inject(TextileTypeRepository)
		private readonly textileTypeRepository: TextileTypeRepository,
	) {}

	async handle(): Promise<TextileType[]> {
		const types = await this.textileTypeRepository.getAllTextileTypes();
		if (types.length === 0) {
			throw new NotFoundException('No types found');
		}
		return types;
	}
}
