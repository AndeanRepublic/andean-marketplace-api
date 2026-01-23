import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileTypeRepository } from '../../datastore/textileProducts/TextileType.repo';
import { TextileType } from 'src/andean/domain/entities/textileProducts/TextileType';

@Injectable()
export class GetByIdTextileTypeUseCase {
	constructor(
		@Inject(TextileTypeRepository)
		private readonly textileTypeRepository: TextileTypeRepository,
	) {}

	async handle(id: string): Promise<TextileType> {
		const typeFound = await this.textileTypeRepository.getTextileTypeById(id);
		if (!typeFound) {
			throw new NotFoundException('Type not found');
		}
		return typeFound;
	}
}
