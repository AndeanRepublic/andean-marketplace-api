import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ColorOptionAlternativeRepository } from '../../datastore/textileProducts/ColorOptionAlternative.repo';
import { ColorOptionAlternative } from 'src/andean/domain/entities/textileProducts/ColorOptionAlternative';
import { ColorOptionAlternativeMapper } from 'src/andean/infra/services/textileProducts/ColorOptionAlternativeMapper';
import { CreateColorOptionAlternativeDto } from 'src/andean/infra/controllers/dto/textileProducts/CreateColorOptionAlternativeDto';

@Injectable()
export class UpdateColorOptionAlternativeUseCase {
	constructor(
		@Inject(ColorOptionAlternativeRepository)
		private readonly colorOptionAlternativeRepository: ColorOptionAlternativeRepository,
	) {}

	async handle(
		id: string,
		dto: CreateColorOptionAlternativeDto,
	): Promise<ColorOptionAlternative> {
		const colorOptionAlternativeFound =
			await this.colorOptionAlternativeRepository.getById(id);
		if (!colorOptionAlternativeFound) {
			throw new NotFoundException('Color option alternative not found');
		}
		const toUpdate = ColorOptionAlternativeMapper.fromUpdateDto(id, dto);
		return this.colorOptionAlternativeRepository.update(id, toUpdate);
	}
}
