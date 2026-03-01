import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SizeOptionAlternativeRepository } from '../../datastore/textileProducts/SizeOptionAlternative.repo';
import { SizeOptionAlternative } from 'src/andean/domain/entities/textileProducts/SizeOptionAlternative';

@Injectable()
export class GetByIdSizeOptionAlternativeUseCase {
	constructor(
		@Inject(SizeOptionAlternativeRepository)
		private readonly sizeOptionAlternativeRepository: SizeOptionAlternativeRepository,
	) {}

	async handle(id: string): Promise<SizeOptionAlternative> {
		const sizeOptionAlternativeFound =
			await this.sizeOptionAlternativeRepository.getById(id);
		if (!sizeOptionAlternativeFound) {
			throw new NotFoundException('Size option alternative not found');
		}
		return sizeOptionAlternativeFound;
	}
}
