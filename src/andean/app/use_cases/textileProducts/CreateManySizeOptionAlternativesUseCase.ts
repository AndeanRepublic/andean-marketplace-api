import { Inject, Injectable } from '@nestjs/common';
import { SizeOptionAlternativeRepository } from '../../datastore/textileProducts/SizeOptionAlternative.repo';
import { CreateManySizeOptionAlternativesDto } from 'src/andean/infra/controllers/dto/textileProducts/CreateManySizeOptionAlternativesDto';
import { SizeOptionAlternative } from 'src/andean/domain/entities/textileProducts/SizeOptionAlternative';
import { SizeOptionAlternativeMapper } from 'src/andean/infra/services/textileProducts/SizeOptionAlternativeMapper';

@Injectable()
export class CreateManySizeOptionAlternativesUseCase {
	constructor(
		@Inject(SizeOptionAlternativeRepository)
		private readonly sizeOptionAlternativeRepository: SizeOptionAlternativeRepository,
	) {}

	async handle(
		dto: CreateManySizeOptionAlternativesDto,
	): Promise<SizeOptionAlternative[]> {
		const sizeOptionAlternativesToSave = dto.sizeOptionAlternatives.map(
			(itemDto) => SizeOptionAlternativeMapper.fromCreateDto(itemDto),
		);
		return this.sizeOptionAlternativeRepository.createMany(
			sizeOptionAlternativesToSave,
		);
	}
}
