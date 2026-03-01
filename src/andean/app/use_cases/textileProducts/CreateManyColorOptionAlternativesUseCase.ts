import { Inject, Injectable } from '@nestjs/common';
import { ColorOptionAlternativeRepository } from '../../datastore/textileProducts/ColorOptionAlternative.repo';
import { CreateManyColorOptionAlternativesDto } from 'src/andean/infra/controllers/dto/textileProducts/CreateManyColorOptionAlternativesDto';
import { ColorOptionAlternative } from 'src/andean/domain/entities/textileProducts/ColorOptionAlternative';
import { ColorOptionAlternativeMapper } from 'src/andean/infra/services/textileProducts/ColorOptionAlternativeMapper';

@Injectable()
export class CreateManyColorOptionAlternativesUseCase {
	constructor(
		@Inject(ColorOptionAlternativeRepository)
		private readonly colorOptionAlternativeRepository: ColorOptionAlternativeRepository,
	) {}

	async handle(
		dto: CreateManyColorOptionAlternativesDto,
	): Promise<ColorOptionAlternative[]> {
		const colorOptionAlternativesToSave = dto.colorOptionAlternatives.map(
			(itemDto) => ColorOptionAlternativeMapper.fromCreateDto(itemDto),
		);
		return this.colorOptionAlternativeRepository.createMany(
			colorOptionAlternativesToSave,
		);
	}
}
