import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TextileTypeRepository } from '../../datastore/textileProducts/TextileType.repo';
import { TextileType } from 'src/andean/domain/entities/textileProducts/TextileType';
import { TextileTypeMapper } from 'src/andean/infra/services/textileProducts/TextileTypeMapper';
import { CreateTextileTypeDto } from 'src/andean/infra/controllers/dto/textileProducts/CreateTextileTypeDto';

@Injectable()
export class UpdateTextileTypeUseCase {
	constructor(
		@Inject(TextileTypeRepository)
		private readonly textileTypeRepository: TextileTypeRepository,
	) {}

	async handle(id: string, dto: CreateTextileTypeDto): Promise<TextileType> {
		const typeFound = await this.textileTypeRepository.getTextileTypeById(id);
		if (!typeFound) {
			throw new NotFoundException('Type not found');
		}
		const toUpdate = TextileTypeMapper.fromUpdateDto(id, dto);
		return this.textileTypeRepository.updateTextileType(id, toUpdate);
	}
}
