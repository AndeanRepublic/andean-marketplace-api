import { Inject, Injectable } from '@nestjs/common';
import { ColorOptionAlternativeRepository } from '../../datastore/textileProducts/ColorOptionAlternative.repo';
import { CreateColorOptionAlternativeDto } from 'src/andean/infra/controllers/dto/textileProducts/CreateColorOptionAlternativeDto';
import { ColorOptionAlternative } from 'src/andean/domain/entities/textileProducts/ColorOptionAlternative';
import { ColorOptionAlternativeMapper } from 'src/andean/infra/services/textileProducts/ColorOptionAlternativeMapper';

@Injectable()
export class CreateColorOptionAlternativeUseCase {
	constructor(
		@Inject(ColorOptionAlternativeRepository)
		private readonly colorOptionAlternativeRepository: ColorOptionAlternativeRepository,
	) {}

	async handle(
		dto: CreateColorOptionAlternativeDto,
	): Promise<ColorOptionAlternative> {
		const colorOptionAlternativeToSave =
			ColorOptionAlternativeMapper.fromCreateDto(dto);
		return this.colorOptionAlternativeRepository.create(
			colorOptionAlternativeToSave,
		);
	}
}
