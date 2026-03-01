import { Inject, Injectable } from '@nestjs/common';
import { SizeOptionAlternativeRepository } from '../../datastore/textileProducts/SizeOptionAlternative.repo';
import { CreateSizeOptionAlternativeDto } from 'src/andean/infra/controllers/dto/textileProducts/CreateSizeOptionAlternativeDto';
import { SizeOptionAlternative } from 'src/andean/domain/entities/textileProducts/SizeOptionAlternative';
import { SizeOptionAlternativeMapper } from 'src/andean/infra/services/textileProducts/SizeOptionAlternativeMapper';

@Injectable()
export class CreateSizeOptionAlternativeUseCase {
	constructor(
		@Inject(SizeOptionAlternativeRepository)
		private readonly sizeOptionAlternativeRepository: SizeOptionAlternativeRepository,
	) {}

	async handle(
		dto: CreateSizeOptionAlternativeDto,
	): Promise<SizeOptionAlternative> {
		const sizeOptionAlternativeToSave =
			SizeOptionAlternativeMapper.fromCreateDto(dto);
		return this.sizeOptionAlternativeRepository.create(
			sizeOptionAlternativeToSave,
		);
	}
}
