import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ColorOptionAlternativeRepository } from '../../datastore/textileProducts/ColorOptionAlternative.repo';

@Injectable()
export class DeleteColorOptionAlternativeUseCase {
	constructor(
		@Inject(ColorOptionAlternativeRepository)
		private readonly colorOptionAlternativeRepository: ColorOptionAlternativeRepository,
	) {}

	async handle(id: string): Promise<void> {
		const colorOptionAlternativeFound =
			await this.colorOptionAlternativeRepository.getById(id);
		if (!colorOptionAlternativeFound) {
			throw new NotFoundException('Color option alternative not found');
		}
		await this.colorOptionAlternativeRepository.delete(id);
		return;
	}
}
