import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SizeOptionAlternativeRepository } from '../../datastore/textileProducts/SizeOptionAlternative.repo';
import { SizeOptionAlternative } from 'src/andean/domain/entities/textileProducts/SizeOptionAlternative';
import { SizeOptionAlternativeMapper } from 'src/andean/infra/services/textileProducts/SizeOptionAlternativeMapper';
import { CreateSizeOptionAlternativeDto } from 'src/andean/infra/controllers/dto/textileProducts/CreateSizeOptionAlternativeDto';

@Injectable()
export class UpdateSizeOptionAlternativeUseCase {
	constructor(
		@Inject(SizeOptionAlternativeRepository)
		private readonly sizeOptionAlternativeRepository: SizeOptionAlternativeRepository,
	) {}

	async handle(
		id: string,
		dto: CreateSizeOptionAlternativeDto,
	): Promise<SizeOptionAlternative> {
		const sizeOptionAlternativeFound =
			await this.sizeOptionAlternativeRepository.getById(id);
		if (!sizeOptionAlternativeFound) {
			throw new NotFoundException('Size option alternative not found');
		}
		const toUpdate = SizeOptionAlternativeMapper.fromUpdateDto(id, dto);
		return this.sizeOptionAlternativeRepository.update(id, toUpdate);
	}
}
