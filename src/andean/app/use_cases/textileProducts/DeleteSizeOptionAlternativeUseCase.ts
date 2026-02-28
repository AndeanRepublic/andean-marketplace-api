import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SizeOptionAlternativeRepository } from '../../datastore/textileProducts/SizeOptionAlternative.repo';

@Injectable()
export class DeleteSizeOptionAlternativeUseCase {
	constructor(
		@Inject(SizeOptionAlternativeRepository)
		private readonly sizeOptionAlternativeRepository: SizeOptionAlternativeRepository,
	) {}

	async handle(id: string): Promise<void> {
		const sizeOptionAlternativeFound =
			await this.sizeOptionAlternativeRepository.getById(id);
		if (!sizeOptionAlternativeFound) {
			throw new NotFoundException('Size option alternative not found');
		}
		await this.sizeOptionAlternativeRepository.delete(id);
		return;
	}
}
