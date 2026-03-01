import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { TextileTypeRepository } from '../../datastore/textileProducts/TextileType.repo';
import { CreateTextileTypeDto } from 'src/andean/infra/controllers/dto/textileProducts/CreateTextileTypeDto';
import { TextileType } from 'src/andean/domain/entities/textileProducts/TextileType';
import { TextileTypeMapper } from 'src/andean/infra/services/textileProducts/TextileTypeMapper';

@Injectable()
export class CreateTextileTypeUseCase {
	constructor(
		@Inject(TextileTypeRepository)
		private readonly textileTypeRepository: TextileTypeRepository,
	) {}

	async handle(dto: CreateTextileTypeDto): Promise<TextileType> {
		const typeFound = await this.textileTypeRepository.getTextileTypeByName(
			dto.name,
		);
		if (typeFound) {
			throw new BadRequestException('Type already exists');
		}
		const textileTypeToSave = TextileTypeMapper.fromCreateDto(dto);
		return this.textileTypeRepository.saveTextileType(textileTypeToSave);
	}
}
