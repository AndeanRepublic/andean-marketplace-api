import { Inject, Injectable } from '@nestjs/common';
import { TextileTypeRepository } from '../../datastore/textileProducts/TextileType.repo';
import { CreateManyTextileTypesDto } from 'src/andean/infra/controllers/dto/textileProducts/CreateManyTextileTypesDto';
import { TextileType } from 'src/andean/domain/entities/textileProducts/TextileType';
import { TextileTypeMapper } from 'src/andean/infra/services/textileProducts/TextileTypeMapper';

@Injectable()
export class CreateManyTextileTypesUseCase {
	constructor(
		@Inject(TextileTypeRepository)
		private readonly textileTypeRepository: TextileTypeRepository,
	) {}

	async handle(dto: CreateManyTextileTypesDto): Promise<TextileType[]> {
		const textileTypesToSave = dto.textileTypes.map((itemDto) =>
			TextileTypeMapper.fromCreateDto(itemDto),
		);
		return this.textileTypeRepository.createManyTextileTypes(textileTypesToSave);
	}
}
